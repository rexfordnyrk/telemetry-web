import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  designation: string;
  organization: string;
  photo?: string;
  status: "active" | "disabled" | "pending";
  roles: Role[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  availableRoles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      first_name: "John",
      last_name: "Smith",
      username: "john_smith",
      email: "john.smith@example.com",
      phone: "+1234567890",
      designation: "Software Engineer",
      organization: "Tech Corp",
      photo: "/assets/images/avatars/01.png",
      status: "active",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440010",
          name: "admin",
          description: "Administrator role with full permissions",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      first_name: "Sarah",
      last_name: "Johnson",
      username: "sarah_johnson",
      email: "sarah.johnson@example.com",
      phone: "+1234567891",
      designation: "UI/UX Designer",
      organization: "Design Studio",
      photo: "/assets/images/avatars/02.png",
      status: "active",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          name: "manager",
          description: "Manager role with team permissions",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-20T00:00:00Z",
      updated_at: "2024-01-20T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      first_name: "Mike",
      last_name: "Wilson",
      username: "mike_wilson",
      email: "mike.wilson@example.com",
      phone: "+1234567892",
      designation: "Marketing Specialist",
      organization: "Marketing Inc",
      status: "pending",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "user",
          description: "Basic user role",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-25T00:00:00Z",
      updated_at: "2024-01-25T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      first_name: "Emily",
      last_name: "Davis",
      username: "emily_davis",
      email: "emily.davis@example.com",
      phone: "+1234567893",
      designation: "Financial Analyst",
      organization: "Finance Ltd",
      status: "disabled",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "user",
          description: "Basic user role",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-10T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      first_name: "Robert",
      last_name: "Brown",
      username: "robert_brown",
      email: "robert.brown@example.com",
      phone: "+1234567894",
      designation: "Senior Developer",
      organization: "Engineering Co",
      status: "active",
      roles: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          name: "manager",
          description: "Manager role with team permissions",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          name: "user",
          description: "Basic user role",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-05T00:00:00Z",
    },
  ],
  selectedUser: null,
  availableRoles: [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "admin",
      description: "Administrator role with full permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440011",
      name: "manager",
      description: "Manager role with team permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440012",
      name: "user",
      description: "Basic user role",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440013",
      name: "developer",
      description: "Developer role with coding permissions",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
  ],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    assignRole: (
      state,
      action: PayloadAction<{ userId: string; role: Role }>,
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user && !user.roles.find((r) => r.id === action.payload.role.id)) {
        user.roles.push(action.payload.role);
      }
    },
    removeRole: (
      state,
      action: PayloadAction<{ userId: string; roleId: string }>,
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user && user.roles.length > 1) {
        user.roles = user.roles.filter((r) => r.id !== action.payload.roleId);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setSelectedUser,
  assignRole,
  removeRole,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
