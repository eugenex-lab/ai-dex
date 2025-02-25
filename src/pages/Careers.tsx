import { jobPositions } from "@/components/careers/jobPositions";
import { JobCard } from "@/components/careers/JobCard";
import { ApplicationForm } from "@/components/careers/ApplicationForm";

const CareersPage = () => {
  return (
    <div className="container mx-auto px-4 pt-20 pb-16 sm:pt-16 sm:pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Join the Tradenly Team
          </h1>
          <p className="text-lg text-muted-foreground">
            At Tradenly, we are building the future of decentralized trading,
            and we're looking for passionate, talented individuals to join our
            team. Whether you're a developer, engineer, or marketer, there's a
            place for you at Tradenly to help shape the next generation of
            crypto trading tools.
          </p>
        </div>

        <div className="grid gap-8">
          {jobPositions.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        <ApplicationForm />
      </div>
    </div>
  );
};

export default CareersPage;
