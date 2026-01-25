export default function SubmissionCard({
  submission,
  onApprove,
}: {
  submission: Submission;
  onApprove: () => void;
}) {
  return (
    <Card>
      <UserInfo user={submission.user} />
      <Content content={submission.content} />
      <StatusBadge status={submission.status} />
      {submission.status === "pending" && (
        <Button onClick={onApprove}>Approve</Button>
      )}
    </Card>
  );
}