interface Props {
  params: Promise<{ chapterId: string }>;
}

const ChapterDetailPage = async ({ params }: Props) => {
  const { chapterId } = await params;

  return <div>{chapterId}</div>;
};

export default ChapterDetailPage;
