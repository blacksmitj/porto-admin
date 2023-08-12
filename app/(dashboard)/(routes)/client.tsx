"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@prisma/client";

interface DashboardClientProps {
  currentUser: User | null;
}

const DashboardClient: React.FC<DashboardClientProps> = ({ currentUser }) => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your CV" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
