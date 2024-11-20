"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function GenePredictionForm() {
  const [geneValues, setGeneValues] = useState({
    "ENSG00000141510.18 TP53": 2.3965e1,
    "ENSG00000146648.19 EGFR": 3.00449e1,
    "ENSG00000168702.18 LRP1B": 2.1e-2,
    "ENSG00000133703.13 KRAS": 1.36955e1,
    "ENSG00000116044.16 NFE2L2": 7.83391e1,
    "ENSG00000147889.18 CDKN2A": 1.37,
    "ENSG00000101825.8 MXRA5": 8.4368,
    "ENSG00000110628.16 SLC22A18": 6.6384,
    "ENSG00000008226.20 DLEC1": 5.766e-1,
    "ENSG00000141736.14 ERBB2": 5.81037e1,
    "ENSG00000157764.14 BRAF": 3.7789,
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [caseid, setCaseid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (gene: string, value: string) => {
    setGeneValues((prev) => ({
      ...prev,
      [gene]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:8002/get_prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(geneValues),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setCaseid(data.caseid);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while fetching the prediction");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>TPM values of specific genes</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(geneValues).map(([gene, value]) => (
            <div key={gene} className="grid grid-cols-2 gap-4 items-center">
              <Label htmlFor={gene}>{gene}</Label>
              <Input
                id={gene}
                type="number"
                value={value}
                onChange={(e) => handleInputChange(gene, e.target.value)}
                step="any"
              />
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Predicting..." : "Get Prediction"}
          </Button>
        </form>
        {prediction && (
          <>
            <div
              className={`mt-4 p-4 ${
                prediction > 50
                  ? "bg-red-100 text-red-800 "
                  : "bg-green-100 text-green-800 "
              } rounded-md`}
            >
              <h3 className="font-semibold">Prediction Result:</h3>
              <p>{prediction}% chance of lung cancer</p>
            </div>
            {prediction > 50 ? (
              <div
                className={`mt-4 p-4 ${
                  prediction > 50
                    ? "bg-red-100 text-red-800 "
                    : "bg-green-100 text-green-800 "
                } rounded-md`}
              >
                <h3 className="font-semibold">Best Matching Case File:</h3>
                <p>Click on the case_id to proceed</p>
                <a
                  className="hover:underline"
                  target="_blank"
                  href={`https://portal.gdc.cancer.gov/files/${caseid}`}
                >
                  {caseid}
                </a>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
