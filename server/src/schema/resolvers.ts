import User  from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';



interface saveBookArgs {
    bookInfo:{
        authors: string[];
        description: string;
        title: string;
        image: string;
        link: string;
    }
}
interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}



const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
        }
        throw new AuthenticationError('You need to be logged in!');
    },
  },


  Mutation: {
    login: async (_parent: unknown, { email, password }: { email: string, password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addUser: async (_parent: unknown, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: unknown, { bookInfo }:  saveBookArgs, context: any) => {
      if (context.user) {
        throw new AuthenticationError('User not logged in!');
        }
        return User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookInfo } },
          { new: true, runValidators: true }
        );
      },

    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
    },
  };

export default resolvers;



