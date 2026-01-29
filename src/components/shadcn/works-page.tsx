import type { WorkItem } from "@/lib/works";
import { WorkComponent } from "./work";

interface WorksPageProps {
  works: WorkItem[];
}

export const WorksPage = ({ works }: WorksPageProps) => {
  return (
    <div className="xl:w-4/5 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {works.map((work, index) => (
          <WorkComponent
            key={`work-${work.path || index}`}
            thumbnail={work.image}
            title={work.title}
            date={work.date}
            description={work.description}
            tags={work.tags}
            url={work.url}
            github={work.github}
            path={work.path}
          />
        ))}
      </div>
    </div>
  );
};
