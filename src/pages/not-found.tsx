import { useNavigate } from "react-router";

import Button from "@/components/UI/Button";

const NotFound = () => {
  const navigation = useNavigate();

  return (
    <div className="container flex min-h-[calc(100vh-129px)] flex-col items-center justify-center py-16">
      <div className="bg-card/50 w-full max-w-lg rounded-3xl border border-white/10 p-8 text-center shadow-2xl shadow-black/20 sm:p-12">
        <p className="text-primary mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
          Error 404
        </p>
        <h1 className="mb-4 text-5xl font-bold text-white sm:text-6xl">
          Lost signal
        </h1>
        <h2 className="mb-3 text-lg font-semibold text-white">
          Page Not Found
        </h2>
        <p className="text-secondary mb-8 text-sm leading-6">
          The page you're looking for doesn't exist.
        </p>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={() => navigation("/")}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
