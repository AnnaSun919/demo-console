import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <Card className="w-[400px] text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Access Denied
          </CardTitle>
          <CardDescription>
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please contact your administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {isLoggedIn ? (
            <Button className="w-full" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          ) : (
            <Button className="w-full" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
