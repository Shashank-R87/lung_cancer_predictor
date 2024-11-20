import Details from "@/components/details";
import { GenePredictionForm } from "@/components/gene-prediction-form";

export default function Page() {
  return (
    <div className="flex flex-row justify-end items-center w-full p-28 gap-20">
      <Details/>
      <GenePredictionForm />
    </div>
  );
}
