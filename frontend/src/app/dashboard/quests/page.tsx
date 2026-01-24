import QuestHeader from "./components/QuestHeader";
import Questlist from "./components/Questlist";
import Quests from "./components/Quests";

export default function QuestsPage() {
  return (
    <section className="min-h-full  text-white px-6">
      <QuestHeader />
      <Quests />
      <Questlist />
    </section>
  );
}
