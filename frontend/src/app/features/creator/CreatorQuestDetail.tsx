export default function CreatorQuestDetail({
  quest,
  submissions,
}: {
  quest: Quest;
  submissions: Submission[];
}) {
  const handleApprove = (submissionId: string) => {
    // API call to approve submission
  };

  return (
    <div>
      <Header title={quest.title} />
      <TaskInfo task={quest} />
      <Button onClick={() => navigate(`/creator/quests/${quest.id}/edit`)}>Edit Quest</Button>

      <h3>Submissions ({submissions.length})</h3>
      {submissions.length === 0 ? (
        <EmptyState message="No submissions yet." />
      ) : (
        submissions.map((sub) => (
          <SubmissionCard
            key={sub.id}
            submission={sub}
            onApprove={() => handleApprove(sub.id)}
          />
        ))
      )}
    </div>
  );
}