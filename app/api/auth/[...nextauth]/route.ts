import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import Creator, { ICreator } from '@/models/Creator';
import User, { IUser } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

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
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
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

            // If they're trying to create an account type they already have
            if (
              (type === 'creator' && existingCreator) ||
              (type === 'user' && existingUser)
            ) {
              throw new Error('You already have this type of account');
            }

            // If they have an existing account of a different type, we'll add the new type
            if (existingCreator || existingUser) {
              if (!name) {
                throw new Error('Name is required for signup');
              }

              const hashedPassword = await bcrypt.hash(password, 10);
              const username = email.split('@')[0];

              if (type === 'creator' && existingUser) {
                console.log('Adding creator account to existing user...');
                const newCreator = await Creator.create({
                  email,
                  password: hashedPassword,
                  username,
                  name,
                });
                console.log('Creator account added:', newCreator);

                return {
                  id: newCreator._id.toString(),
                  email: newCreator.email,
                  name: newCreator.name,
                  type: 'creator' as const,
                  needsTypeSelection: true,
                  hasCreatorAccount: true,
                  hasUserAccount: true,
                };
              } else if (type === 'user' && existingCreator) {
                console.log('Adding user account to existing creator...');
                const newUser = await User.create({
                  email,
                  password: hashedPassword,
                  username,
                  name,
                });
                console.log('User account added:', newUser);

                return {
                  id: newUser._id.toString(),
                  email: newUser.email,
                  name: newUser.name,
                  type: 'user' as const,
                  needsTypeSelection: true,
                  hasCreatorAccount: true,
                  hasUserAccount: true,
                };
              }
            }

            // If no existing accounts, create a new one
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

            // Check if either account exists
            if (!creator && !user) {
              throw new Error('No account found with this email');
            }

            // Check password for the appropriate account
            const account = creator || user;
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

            // Single account type - use the account that exists
            return {
              id: account._id.toString(),
              email: account.email,
              name: account.name,
              type: creator ? 'creator' : 'user',
              needsTypeSelection: false,
              hasCreatorAccount: !!creator,
              hasUserAccount: !!user,
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
      // Initial sign in
      if (user) {
        // This runs when the user first signs in
        return {
          ...token,
          id: user.id,
          type: user.type,
          needsTypeSelection: user.needsTypeSelection,
          hasCreatorAccount: user.hasCreatorAccount,
          hasUserAccount: user.hasUserAccount,
        };
      }

      // For Google sign in
      if (account?.provider === 'google' && profile?.email) {
        await dbConnect();

        console.log('Google sign-in JWT callback:', { account, profile });

        // Check what accounts exist for this email
        const existingCreator = (await Creator.findOne({
          email: profile.email,
        }).lean()) as ICreator;
        const existingUser = await User.findOne({ email: profile.email });

        const hasCreatorAccount = !!existingCreator;
        const hasUserAccount = !!existingUser;

        console.log('Existing accounts:', {
          hasCreatorAccount,
          hasUserAccount,
        });

        // If user has both account types, they need to select one
        if (hasCreatorAccount && hasUserAccount) {
          return {
            ...token,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            hasCreatorAccount: true,
            hasUserAccount: true,
            needsTypeSelection: true,
            type: 'user', // default type
            id: existingUser?._id.toString(), // temporary ID until type is selected
          };
        }

        // If user has only one account type, use that
        if (hasCreatorAccount) {
          return {
            ...token,
            id: existingCreator._id.toString(),
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            type: 'creator',
            needsTypeSelection: false,
            hasCreatorAccount: true,
            hasUserAccount: false,
          };
        }

        if (hasUserAccount) {
          return {
            ...token,
            id: existingUser._id.toString(),
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            type: 'user',
            needsTypeSelection: false,
            hasCreatorAccount: false,
            hasUserAccount: true,
          };
        }

        // If no accounts exist, they'll need to create one
        return {
          ...token,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          hasCreatorAccount: false,
          hasUserAccount: false,
          needsTypeSelection: true,
          type: 'user', // default type
        };
      }

      // Handle session updates
      if (trigger === 'update' && session?.user) {
        return {
          ...token,
          ...session.user,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Copy all relevant fields from token to session.user
        session.user = {
          ...session.user, // Keep existing fields like name, email, image
          id: token.id,
          type: token.type,
          needsTypeSelection: token.needsTypeSelection,
          hasCreatorAccount: token.hasCreatorAccount,
          hasUserAccount: token.hasUserAccount,
        };

        // Only fetch additional user data if we have a final type
        if (!token.needsTypeSelection && token.email) {
          try {
            await dbConnect();
            if (token.type === 'creator') {
              const creator = await Creator.findOne({ email: token.email });
              if (creator) {
                session.user.username = creator.username;
              }
            } else {
              const user = await User.findOne({ email: token.email });
              if (user) {
                session.user.username = user.username;
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
        const existingCreator = (await Creator.findOne({
          email: profile.email,
        }).lean()) as ICreator;
        const existingUser = await User.findOne({ email: profile.email });

        // Set up the user object with the correct properties
        if (existingCreator && existingUser) {
          user.needsTypeSelection = true;
          user.hasCreatorAccount = true;
          user.hasUserAccount = true;
          user.type = 'user'; // default type
          user.id = existingUser._id.toString();
        } else if (existingCreator) {
          user.needsTypeSelection = false;
          user.hasCreatorAccount = true;
          user.hasUserAccount = false;
          user.type = 'creator';
          user.id = existingCreator._id.toString();
        } else if (existingUser) {
          user.needsTypeSelection = false;
          user.hasCreatorAccount = false;
          user.hasUserAccount = true;
          user.type = 'user';
          user.id = existingUser._id.toString();
        } else {
          // New user
          user.needsTypeSelection = true;
          user.hasCreatorAccount = false;
          user.hasUserAccount = false;
          user.type = 'user'; // default type
        }

        console.log('Modified user object:', user);
        return true;
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
