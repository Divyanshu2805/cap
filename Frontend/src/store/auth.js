// Uses Zustand, a lightweight state management library to create an authentication store
import { create } from "zustand";                               // Used to define a new store
import { mountStoreDevtool } from "simple-zustand-devtools";    // Mounts a devtool for inspecting the store’s state when the app is in development mode


/* create is a Zustand function that generates a store. It takes a single function as an argument.
This function has two parameters:

    set: A function provided by Zustand to update the state of the store.
    get: A function to retrieve the current state within the store.

This function returns an "object" containing the store’s initial state and methods (often called "actions") for updating that state. */

const useAuthStore = create((set, get) => ({                    // Store that will manage the authentication-related state
  allUserData: null,                                            // Stores the entire user data object (null) when no user is logged in, otherwise contains user information
  loading: false,                                               // Boolean flag that represents whether an operation (e.g. fetching user data) is currently in progress

  user: () => ({                                                // Provides a user object (stores object) containing user_id and username based on allUserData
    user_id: get().allUserData?.user_id || null,                // Uses Optional Chaining
    username: get().allUserData?.username || null,
  }),

  setUser: (user) =>                                            // Updates allUserData in the store with a new user object
    set({
      allUserData: user,                                        // Uses set to update allUserData to the provided user
    }), 
                                                                // Updates loading state
  setLoading: (loading) => set({ loading }),                    // Accepts loading, a Boolean, to indicate whether an operation is in progress  
                                                                // Uses set to change loading to the provided value
  isLoggedIn: () => get().allUserData !== null,                 // Determines if a user is currently logged in
}));                                                            // Checks if allUserData contains data


if (import.meta.env.DEV) {                                      // Checks if the environment is in development
  mountStoreDevtool("Store", useAuthStore);                     // Mounts developer tools for Zustand’s store in development mode
}

export { useAuthStore };
