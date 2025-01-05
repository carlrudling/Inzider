import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import Creator, { ICreator } from '@/models/Creator';
import User, { IUser } from '@/models/User';
import dbConnect from '@/utils/database';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      type: 'creator' | 'user';
      needsTypeSelection?: boolean;
      hasCreatorAccount?: boolean;
      hasUserAccount?: boolean;
    };
  }

  interface Profile {
    picture?: string;
  }

  interface User {
    id: string;
    type: 'creator' | 'user';
    needsTypeSelection?: boolean;
    hasCreatorAccount?: boolean;
    hasUserAccount?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    type: 'creator' | 'user';
    needsTypeSelection?: boolean;
    email?: string;
    name?: string;
    picture?: string;
    hasCreatorAccount?: boolean;
    hasUserAccount?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' }, // 'signup' or 'login'
        name: { label: 'Name', type: 'text' }, // For collecting name on signup
        type: { label: 'Type', type: 'text' }, // 'creator' or 'user'
      },
      async authorize(credentials) {
        try {
          console.log('Starting authorization...');
          await dbConnect();
          console.log('Database connected');

          const { email, password, mode, name, type } = credentials || {};
          console.log('Credentials received:', { email, mode, name, type });

          if (!email || !password) {
            throw new Error('Please provide both email and password');
          }

          if (mode === 'signup') {
            if (!type || !['creator', 'user'].includes(type)) {
              throw new Error(
                'Please select if you want to be a creator or user'
              );
            }

            // Check if user exists in either collection
            const existingCreator = await Creator.findOne({ email });
            const existingUser = await User.findOne({ email });
            console.log('Existing accounts check:', {
              existingCreator,
              existingUser,
            });

            if (existingCreator || existingUser) {
              throw new Error('Email already registered');
            }

            if (!name) {
              throw new Error('Name is required for signup');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const username = email.split('@')[0];

            if (type === 'creator') {
              console.log('Creating new creator account...');
              const newCreator = await Creator.create({
                email,
                password: hashedPassword,
                username,
                name,
              });
              console.log('Creator account created:', newCreator);

              const returnValue = {
                id: newCreator._id.toString(),
                email: newCreator.email,
                name: newCreator.name,
                type: 'creator' as const,
              };
              console.log('Authorize returning:', returnValue);
              return returnValue;
            } else {
              const newUser = (await User.create({
                email,
                password: hashedPassword,
                username,
                name,
              })) as IUser & { _id: Types.ObjectId };

              return {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name,
                type: 'user' as const,
              };
            }
          } else {
            // Handle login
            const creator = await Creator.findOne({ email });
            const user = await User.findOne({ email });

            const account = creator || user;
            if (!account) {
              throw new Error('No account found with this email');
            }

            if (!account.password) {
              throw new Error('This account uses social login');
            }

            const isPasswordValid = await bcrypt.compare(
              password,
              account.password
            );
            if (!isPasswordValid) {
              throw new Error('Invalid password');
            }

            // If user has both types of accounts, we need to check type selection
            if (creator && user) {
              return {
                id: account._id.toString(),
                email: account.email,
                name: account.name,
                type: 'user', // Default to user, will be changed in check-type
                needsTypeSelection: true,
                hasCreatorAccount: true,
                hasUserAccount: true,
              };
            }

            // Single account type
            return {
              id: account._id.toString(),
              email: account.email,
              name: account.name,
              type: creator ? 'creator' : 'user',
              needsTypeSelection: false,
            };
          }
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // For initial sign in
      if (account && account.provider === 'google') {
        await dbConnect();

        console.log('Google sign-in JWT callback:', { account, profile });

        // Check what accounts exist for this email
        const existingCreator = await Creator.findOne({
          email: profile?.email,
        });
        const existingUser = await User.findOne({ email: profile?.email });

        const hasCreatorAccount = !!existingCreator;
        const hasUserAccount = !!existingUser;

        console.log('Existing accounts:', {
          hasCreatorAccount,
          hasUserAccount,
        });

        // Get the selected type from query parameters
        const params = new URLSearchParams(account.query as string);
        const selectedType = params.get('selectedType') as
          | 'creator'
          | 'user'
          | null;
        console.log('Selected type from query:', selectedType);

        // If a type was selected and the user has that account type, use it
        if (
          selectedType &&
          ((selectedType === 'creator' && hasCreatorAccount) ||
            (selectedType === 'user' && hasUserAccount))
        ) {
          const id =
            selectedType === 'creator'
              ? existingCreator?._id.toString()
              : existingUser?._id.toString();
          return {
            ...token,
            id,
            email: profile?.email,
            name: profile?.name,
            picture: profile?.picture,
            type: selectedType,
            needsTypeSelection: false,
            hasCreatorAccount,
            hasUserAccount,
          };
        }

        // Otherwise, go through type selection
        return {
          ...token,
          email: profile?.email,
          name: profile?.name,
          picture: profile?.picture,
          hasCreatorAccount,
          hasUserAccount,
          needsTypeSelection: true,
          type: 'user', // default type
        };
      }

      // Handle session updates
      if (trigger === 'update' && session?.user) {
        console.log('Session update:', session);
        return {
          ...token,
          ...session.user,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
        session.user.needsTypeSelection = token.needsTypeSelection;
        session.user.hasCreatorAccount = token.hasCreatorAccount;
        session.user.hasUserAccount = token.hasUserAccount;

        if (!token.needsTypeSelection && token.email) {
          try {
            await dbConnect();
            if (token.type === 'creator') {
              const creator = await Creator.findOne({ email: token.email });
              if (creator) {
                session.user.id = creator._id.toString();
                session.user.username = creator.username;
                session.user.type = 'creator';
              }
            } else {
              const user = await User.findOne({ email: token.email });
              if (user) {
                session.user.id = user._id.toString();
                session.user.username = user.username;
                session.user.type = 'user';
              }
            }
          } catch (error) {
            console.error('Error in session callback:', error);
          }
        }
      }
      console.log('Session callback returning:', session);
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      console.log('SignIn Callback - Incoming data:', {
        account,
        profile,
        user,
        credentials,
      });
      if (account?.provider === 'credentials') {
        console.log('SignIn Callback - Credentials provider, user:', user);
        return true;
      }
      if (!profile?.email) return false;

      await dbConnect();

      if (account?.provider === 'google') {
        // Check if user exists in either collection
        const existingCreator = await Creator.findOne({ email: profile.email });
        const existingUser = await User.findOne({ email: profile.email });

        // Allow sign in if user exists or is new
        return true;
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
