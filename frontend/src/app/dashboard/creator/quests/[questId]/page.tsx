import CreatorQuestDetail from "@/app/features/creator/CreatorQuestDetail";

export default function QuestDetailPage({ params }: { params: { questId: string } }) {
  const { questId } = params;
  const { quest, submissions } = useQuestData(questId);

  return (
    <CreatorQuestDetail
      quest={quest}
      submissions={submissions}
    />
  );
}