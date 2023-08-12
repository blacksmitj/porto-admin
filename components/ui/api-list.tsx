import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
  userId: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  entityIdName,
  entityName,
  userId,
}) => {
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${userId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="GET"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};
