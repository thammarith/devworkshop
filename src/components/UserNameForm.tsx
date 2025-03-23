import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserNameFormProps {
  onSubmit: (userName: string) => void;
  initialUserName?: string;
}

const UserNameForm = ({ onSubmit, initialUserName = '' }: UserNameFormProps) => {
  const [userName, setUserName] = useState<string>(initialUserName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onSubmit(userName);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Chat App</CardTitle>
          <CardDescription className="text-center">
            Enter your name to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="h-11"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserNameForm;
