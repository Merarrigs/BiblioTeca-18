import User from "../models/User.js"
import { AuthenticationError, signToken } from "../services/auth.js";

interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface addBookArgs{
  bookData:{
    authors: []
    description: String
    title: String
    image: String
    link: String
  }
}


const resolvers = {
    Query: {
      me: async (_parent: any, _args: any, context: any) => {
        // If the user is authenticated, find and return the user's information along with their thoughts
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('savedBooks');
        }
        // If the user is not authenticated, throw an AuthenticationError
        throw new AuthenticationError('Could not authenticate user.');
      },
      },

    Mutation: {
      addUser: async (_parent: any, { input }: AddUserArgs) => {
        console.log("incoming input: ", input);
        // Create a new user with the provided username, email, and password
        const user = await User.create({ ...input });
      
        // Sign a token with the user's information
        const token = signToken(user.username, user.email, user._id);
      
        // Return the token and the user
        return { token, user };
      },
      
      login: async (_parent: any, { email, password }: LoginUserArgs) => {
        // Find a user with the provided email
        const user = await User.findOne({ email });
      
        // If no user is found, throw an AuthenticationError
        if (!user) {
          throw new AuthenticationError('Could not authenticate user.');
        }
      
        // Check if the provided password is correct
        const correctPw = await user.isCorrectPassword(password);
      
        // If the password is incorrect, throw an AuthenticationError
        if (!correctPw) {
          throw new AuthenticationError('Could not authenticate user.');
        }
      
        // Sign a token with the user's information
        const token = signToken(user.username, user.email, user._id);
      
        // Return the token and the user
        return { token, user };
      },
      
      saveBook: async (_: any, { bookData }: addBookArgs, context: any) => {
        if (!context.user) {
          throw new AuthenticationError('Not logged in');
        }
  
        return User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
      },
      
      removeBook: async (_: any, { bookId }: { bookId: string }, context: any) => {
        if (!context.user) {
          throw new AuthenticationError('Not logged in');
        }
  
        if (!bookId) {
          throw new Error('Book ID is required'); 
        }
  
        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      },
        
    }
}
export default resolvers;