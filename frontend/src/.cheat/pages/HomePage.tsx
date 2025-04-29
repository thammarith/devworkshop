import UserNameForm from '@/components/UserNameForm';

interface HomePageProps {
    onSubmit: (userName: string) => void;
    initialUserName: string;
}

const HomePage = ({ onSubmit, initialUserName }: HomePageProps) => {
    return <UserNameForm onSubmit={onSubmit} initialUserName={initialUserName} />;
};

export default HomePage;
