import { TitleForm } from "../components/title-form";

export const CreateCourseView = () => {
  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 h-[50vh]">
      <div className="h-full w-full flex flex-col gap-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Name Your Course</h1>
          <p className="text-sm text-muted-foreground">
            What would you like to name your couse? Don&apos;t worry, you can
            change this later.
          </p>
        </div>
        <TitleForm />
      </div>
    </div>
  );
};
