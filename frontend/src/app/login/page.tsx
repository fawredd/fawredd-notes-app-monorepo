import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 h-screen flex items-center justify-center">
      <div className="p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <LoginForm />
      </div>
    </main>
  );
}
