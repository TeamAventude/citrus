import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "components/shared";

export function LoginForm({ onSubmit }: any) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Citrus65</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-4">Login</CardContent>
      </Card>
    </div>
  );
}
