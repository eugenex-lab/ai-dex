import { JobPosition } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface JobCardProps {
  job: JobPosition;
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier curve
        staggerChildren: 0.1,
      }}
    >
      <Card className="bg-secondary/20 border border-white/10 glass-card hover:scale-[1.02] transition-transform duration-300">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{job.title}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            What We're Looking For:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-foreground">
              Requirements:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Your Role:</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {job.role.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
