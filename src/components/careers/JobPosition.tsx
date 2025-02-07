
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface JobRequirement {
  requirements: string[];
  role: string[];
}

interface JobPositionProps {
  title: string;
  requirements: string[];
  role: string[];
}

export const JobPosition = ({ title, requirements, role }: JobPositionProps) => {
  return (
    <Card className="bg-secondary/20 border border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          What We're Looking For:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-foreground">Requirements:</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-foreground">Your Role:</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {role.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
