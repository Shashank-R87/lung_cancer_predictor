import React from "react";
import { CardHeader, CardTitle } from "./ui/card";

function Details() {
  return (
    <div className="h-full w-full flex flex-col gap-6 justify-start items-start pr-20">
      <CardTitle className="text-4xl flex justify-end items-end gap-5">
        <img
          width="80"
          height="80"
          src="https://img.icons8.com/ios-filled/80/lungs.png"
          alt="lungs"
        />
        Lung Cancer Predictor
      </CardTitle>
      <p className="text-lg text-justify">
        In this project, we developed a predictive model to identify lung cancer
        cases using gene expression data data provided by the Genomic Data
        Commons (GDC), specifically focusing on genes known to contribute to
        lung cancer. These genes were selected based on information from
        reputable biological databases such as NCBI, NCI Genomic Data Commons
        (GDC) and UniProt and various research works on lung cancer. TPM
        (Transcripts Per Million) values for each of these genes were analyzed
        across approximately 2000 test samples, with each sample being compared
        to all others to identify the closest match based on gene expression
        patterns.
      </p>
      <p className="text-lg text-justify italic">
        <span className="font-bold underline">Disclaimer</span> <br />
        This project is intended for research and educational purposes only. The
        predictive model developed here is not designed for clinical diagnosis
        or treatment and should not be used as a substitute for professional
        medical advice. While gene expression data can provide valuable
        insights, the accuracy and applicability of this model are limited by
        the dataset, methodology, and computational techniques used. Further
        validation with clinically approved tools and datasets is essential
        before any real-world application. Always consult healthcare
        professionals for medical decisions.
      </p>
    </div>
  );
}

export default Details;
