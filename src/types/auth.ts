export interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// POST /api/auth/register
// POST /api/auth/login
export interface AuthData {
  token: string;
  user: UserData;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
  // {
  //   token: string;
  //   user: {
  //     id: number;
  //     name: string;
  //     username: string;
  //     email: string;
  //     phone: string;
  //     avatarUrl: string | null;
  //   };
  // };
}
// export interface AuthResponse {
//   success: boolean;
//   message: string;
//   data: {
//     token: string;
//     user: {
//       id: number;
//       name: string;
//       username: string;
//       email: string;
//       phone: string;
//       avatarUrl: string | null;
//     };
//   };
// }

export interface AuthCardProps {
  title: string;
  subtitle: string;
  activeTab: "login" | "register";
  children: React.ReactNode;
}
