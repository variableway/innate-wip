# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: jsx
# Normalized: js
# Block index: 5

// Built-in React state
const [user, setUser] = useState(null);

// Context for sharing state
const UserContext = createContext();

// External libraries like Zustand
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Or Redux Toolkit for complex apps
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    }
  }
});