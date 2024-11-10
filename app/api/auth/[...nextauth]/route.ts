import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook'; // Import Facebook provider
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongoose'; // Import ObjectId type if needed
import Creator, { ICreator } from '../../../models/creator';
import dbConnect from '../../../utils/database';

// Extend the NextAuth Session interface to include the custom id property
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null; // Add username to session
    };
  }

  interface Profile {
    picture?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

const options: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
    // Credentials Provider for email/password authentication
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' }, // 'signup' or 'login'
        name: { label: 'Name', type: 'text' }, // For collecting name on signup
      },
      async authorize(credentials) {
        await dbConnect(); // Ensure DB connection

        const { email, password, mode, name } = credentials || {};

        // Ensure email and password are provided
        if (!email || !password) {
          throw new Error('Please provide both email and password');
        }

        if (mode === 'signup') {
          console.log('Signing up new user...'); // Debugging: Check signup flow
          // Handle sign-up logic
          const existingUser = await Creator.findOne({ email });
          if (existingUser) {
            throw new Error('User already exists with this email');
          }

          // Ensure name is provided during signup
          if (!name) {
            throw new Error('Name is required for signup');
          }

          // Hash the password and create a new user
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await Creator.create({
            email,
            password: hashedPassword,
            username: email.split('@')[0], // Default username based on email
            name, // Save the provided name
          });

          console.log('New user created:', newUser); // Debugging: Log new user creation

          // Return the new user data
          return {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.username,
          };
        } else {
          // Handle login logic
          console.log('Logging in user...'); // Debugging: Check login flow
          const user = await Creator.findOne({ email });
          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check if user has a password
          if (!user.password) {
            throw new Error(
              'This user does not have a password (maybe registered via Google or Facebook)'
            );
          }

          // Safely compare passwords with bcrypt
          const isPasswordValid = await bcrypt.compare(
            password,
            user.password as string
          );
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Return user data if everything is valid
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
          };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      console.log('Session Callback - Session Data: ', session);
      if (session.user?.email) {
        await dbConnect();

        const sessionUser = (await Creator.findOne({
          email: session.user.email,
        })) as ICreator | null;

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.username = sessionUser.username; // Add username to session
          console.log('Session User Found: ', sessionUser);
        } else {
          console.log('No Session User Found for Email: ', session.user.email);
        }
      }
      return session;
    },

    async signIn({ account, profile }) {
      try {
        await dbConnect();

        // Check if the provider is either Google or Facebook
        if (
          account?.provider === 'google' ||
          account?.provider === 'facebook'
        ) {
          console.log(`${account.provider} Sign-In Profile: `, profile);

          const email = profile?.email;
          const name = profile?.name || (profile as any)?.given_name; // Safe access for given_name
          const picture = profile?.picture || (profile as any)?.image; // Facebook uses `picture`, Google uses `image`

          // Check if the user already exists
          const userExists = await Creator.findOne({ email });

          if (!userExists && email && name && picture) {
            console.log(`Creating New User via ${account.provider}: `, profile);

            // Create a unique username if the profile name is taken
            let username = name.replace(/\s+/g, '').toLowerCase();
            const usernameExists = await Creator.findOne({ username });
            if (usernameExists) {
              username = `${username}${Math.floor(Math.random() * 10000)}`;
            }

            // Create a new user in the database
            await Creator.create({
              name: name,
              email: email,
              username: username, // Save the new unique username
              image: picture,
            });

            console.log(
              `New User Created via ${account.provider}: ${username}`
            );
          }
        }

        // Credentials (Email/Password) Sign-In logic happens via `authorize`
        return true;
      } catch (error) {
        console.error(
          `Error checking if user exists via ${account?.provider}: `,
          (error as Error).message
        );
        return false;
      }
    },
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
};

const handler = NextAuth(options);

// Use named exports for each HTTP method
export { handler as GET, handler as POST };
