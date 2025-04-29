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
  };

  return (
    <></>
  );
};

export default UserNameForm;
