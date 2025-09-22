"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Check,
  User,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { DatasetType, GenerationRequest } from "@/types";
import { templates, llmModels } from "@/utils/mockData";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useBalances } from "@/hooks/useBalances";
import Confetti from "@/components/ui/Confetti";
import { useConfetti } from "@/hooks/useConfetti";

export default function GeneratePage() {
  const router = useRouter();
  const { isConnected, chainId } = useAccount();
  const { showConfetti } = useConfetti();
  const { data: balances, isLoading: isLoadingBalances } = useBalances();
  const { uploadFileMutation, uploadedInfo, handleReset, status, progress } =
    useFileUpload();
  const { isPending: isUploading, mutateAsync: uploadFile } =
    uploadFileMutation;

  const [step, setStep] = useState(1);
  const [request, setRequest] = useState<GenerationRequest>({
    type: "tabular",
    prompt: "",
    size: 50,
    template: "",
    model: "gpt-4",
  });
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [listingData, setListingData] = useState({
    name: "",
    description: "",
    price: 5,
    tags: "",
    listOnMarketplace: true,
  });

  const datasetTypes = [
    {
      type: "tabular" as DatasetType,
      label: "Tabular",
      description: "Structured data in rows and columns",
      icon: "📊",
    },
    {
      type: "text" as DatasetType,
      label: "Text",
      description: "Natural language content",
      icon: "📝",
    },
    {
      type: "time-series" as DatasetType,
      label: "Time-Series",
      description: "Sequential data over time",
      icon: "📈",
    },
    {
      type: "images" as DatasetType,
      label: "Images",
      description: "Visual synthetic data",
      icon: "🖼️",
    },
  ];

  const generateDataset = async () => {
    setStep(4);
    setIsGenerating(true);
    // Simulate API call for dataset generation
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // Mock generated data based on type
    const mockData =
      request.type === "tabular"
        ? [
            {
              id: 1,
              name: "John Doe",
              age: 32,
              occupation: "Engineer",
              salary: 75000,
            },
            {
              id: 2,
              name: "Jane Smith",
              age: 28,
              occupation: "Designer",
              salary: 68000,
            },
            {
              id: 3,
              name: "Mike Johnson",
              age: 35,
              occupation: "Manager",
              salary: 85000,
            },
          ]
        : request.type === "text"
        ? [
            {
              content:
                "This product exceeded my expectations. Great quality and fast shipping!",
            },
            {
              content:
                "Decent value for money. Could be better but overall satisfied.",
            },
            {
              content:
                "Outstanding customer service and product quality. Highly recommended!",
            },
          ]
        : [
            {
              timestamp: "2025-01-15T09:00:00Z",
              value: 23.5,
              sensor: "temp_01",
            },
            {
              timestamp: "2025-01-15T09:01:00Z",
              value: 23.7,
              sensor: "temp_01",
            },
            {
              timestamp: "2025-01-15T09:02:00Z",
              value: 23.9,
              sensor: "temp_01",
            },
          ];

    setGeneratedData(mockData);
    setIsGenerating(false);
  };

  // Convert generated data to JSON file
  const createJsonFile = (data: any[], filename: string): File => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    return new File([blob], filename, { type: "application/json" });
  };

  const saveDataset = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    // Just move to step 5 to show the form, don't start upload yet
    setStep(5);
  };

  const uploadDataset = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    setIsGenerating(true);

    try {
      // Create JSON file from generated data
      const jsonFile = createJsonFile(
        generatedData,
        `${listingData.name || "dataset"}.json`
      );

      // Upload the file using the upload hook
      await uploadFile(jsonFile);

      setIsSaved(true);
      setIsGenerating(false);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsGenerating(false);
    }
  };

  const resetUploadState = () => {
    handleReset();
    setIsSaved(false);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
              stepNumber <= step
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {stepNumber < step ? <Check className="w-4 h-4" /> : stepNumber}
          </div>
          {stepNumber < 5 && (
            <div
              className={`w-16 h-0.5 transition-all duration-200 ${
                stepNumber < step ? "bg-teal-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Generate Synthetic Dataset
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Create AI-ready synthetic data in just a few steps
          </p>
          {isConnected && chainId !== 314159 && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md mt-2">
              ⚠️ Filecoin mainnet is not supported yet. Please use Filecoin
              Calibration network.
            </p>
          )}
        </div>

        <StepIndicator />

        {/* Wallet Connection Check */}
        {!isConnected ? (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600">
                Please connect your wallet to generate and upload datasets
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8">
                <ConnectButton />
                <p className="mt-4 text-sm text-gray-500">
                  You need to connect your wallet to use this feature
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Step 1: Select Dataset Type */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Select Dataset Type
                  </h2>
                  <p className="text-gray-600">
                    Choose the type of synthetic data you want to generate
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {datasetTypes.map(({ type, label, description, icon }) => (
                      <div
                        key={type}
                        onClick={() => setRequest({ ...request, type })}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                          request.type === type
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        <div className="text-2xl mb-3">{icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {label}
                        </h3>
                        <p className="text-gray-600 text-sm">{description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button onClick={() => setStep(2)} disabled={!request.type}>
                      Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select AI Model */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Choose AI Model
                  </h2>
                  <p className="text-gray-600">
                    Select the LLM that will generate your{" "}
                    <span className="font-medium text-teal-600 capitalize">
                      {request.type}
                    </span>{" "}
                    dataset
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {llmModels
                      .filter((model) => model.bestFor.includes(request.type))
                      .map((model) => (
                        <div
                          key={model.id}
                          onClick={() =>
                            setRequest({ ...request, model: model.id })
                          }
                          className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 relative ${
                            request.model === model.id
                              ? "border-teal-500 bg-teal-50"
                              : "border-gray-200 hover:border-teal-300"
                          }`}
                        >
                          {model.bestFor.includes(request.type) &&
                            model.id === "gpt-4" && (
                              <div className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Recommended
                              </div>
                            )}
                          <div className="flex items-start justify-between mb-3">
                            <div className="text-2xl">{model.icon}</div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {model.provider}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {model.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {model.description}
                          </p>
                          <div className="text-xs text-teal-600 font-medium">
                            {model.pricing}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!request.model}
                    >
                      Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Input Prompt */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Describe Your Dataset
                  </h2>
                  <p className="text-gray-600">
                    Use natural language to describe what data you need
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dataset Prompt
                      </label>
                      <textarea
                        value={request.prompt}
                        onChange={(e) =>
                          setRequest({ ...request, prompt: e.target.value })
                        }
                        placeholder="Describe the synthetic data you want to generate..."
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dataset Size
                      </label>
                      <select
                        value={request.size}
                        onChange={(e) =>
                          setRequest({
                            ...request,
                            size: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value={10}>10 rows</option>
                        <option value={25}>25 rows</option>
                        <option value={50}>50 rows</option>
                        <option value={100}>100 rows</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Quick Start Templates
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {templates[request.type]?.map(({ name, prompt }) => (
                          <button
                            key={name}
                            onClick={() =>
                              setRequest({ ...request, prompt, template: name })
                            }
                            className="p-4 text-left border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
                          >
                            <div className="font-medium text-gray-900">
                              {name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {prompt}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      onClick={generateDataset}
                      disabled={!request.prompt}
                    >
                      Generate Preview <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Preview Dataset */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Preview Your Dataset
                  </h2>
                  <p className="text-gray-600">
                    Review the generated data before saving
                  </p>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="relative mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl animate-pulse">
                          {
                            datasetTypes.find((t) => t.type === request.type)
                              ?.icon
                          }
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-white animate-spin" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Generating Your Dataset
                      </h3>
                      <p className="text-gray-600 text-center max-w-md mb-6">
                        Using{" "}
                        <span className="font-semibold text-teal-600">
                          {llmModels.find((m) => m.id === request.model)?.name}
                        </span>{" "}
                        to create
                        <span className="font-semibold text-teal-600">
                          {" "}
                          {request.size} rows
                        </span>{" "}
                        of synthetic data...
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-3">
                          {
                            datasetTypes.find((t) => t.type === request.type)
                              ?.icon
                          }
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Dataset Generated Successfully!
                        </h3>
                        <p className="text-gray-600">
                          {request.size} rows •{" "}
                          {Object.keys(generatedData[0] || {}).length} columns
                        </p>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                {Object.keys(generatedData[0] || {}).map(
                                  (key) => (
                                    <th
                                      key={key}
                                      className="text-left py-3 px-4 font-medium text-gray-900"
                                    >
                                      {key}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {generatedData.map((row, index) => (
                                <tr
                                  key={index}
                                  className="border-t border-gray-100"
                                >
                                  {Object.values(row).map((value, colIndex) => (
                                    <td
                                      key={colIndex}
                                      className="py-3 px-4 text-gray-600"
                                    >
                                      {String(value)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={generateDataset}>
                          <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                        </Button>
                        <Button onClick={saveDataset}>
                          <ArrowRight className="w-4 h-4 mr-2" /> Continue
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 5: Save & Store */}
            {step === 5 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isSaved ? "Dataset Published!" : "Publish Your Dataset"}
                  </h2>
                  <p className="text-gray-600">
                    {isSaved
                      ? "Your dataset has been successfully uploaded to Filecoin"
                      : "Add details to save and optionally list on the marketplace"}
                  </p>
                </CardHeader>
                <CardContent>
                  {isSaved ? (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Dataset Published Successfully! 🎉
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Your dataset{" "}
                        <span className="font-semibold text-teal-600">
                          "{listingData.name}"
                        </span>{" "}
                        has been successfully uploaded to Filecoin
                        {listingData.listOnMarketplace &&
                          " and is now live on the marketplace"}
                        .
                      </p>

                      <div className="bg-white/60 rounded-lg p-4 mb-6 max-w-sm mx-auto">
                        <div className="text-sm text-gray-600 mb-2">
                          Dataset Details
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium">
                              {request.size} rows
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="font-medium capitalize">
                              {request.type}
                            </span>
                          </div>
                          {listingData.listOnMarketplace && (
                            <div className="flex justify-between">
                              <span>Price:</span>
                              <span className="font-medium text-teal-600">
                                ${listingData.price} USDFC
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => router.push("/dashboard")}>
                          <User className="w-4 h-4 mr-2" />
                          View in Dashboard
                        </Button>
                        {listingData.listOnMarketplace && (
                          <Button
                            variant="outline"
                            onClick={() => router.push("/marketplace")}
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            View on Marketplace
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => {
                            resetUploadState();
                            setStep(1);
                            setRequest({
                              type: "tabular",
                              prompt: "",
                              size: 50,
                              template: "",
                              model: "gpt-4",
                            });
                            setGeneratedData([]);
                            setListingData({
                              name: "",
                              description: "",
                              price: 5,
                              tags: "",
                              listOnMarketplace: true,
                            });
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Generate Another
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 mt-4">
                        Redirecting to dashboard in a few seconds...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dataset Name *
                        </label>
                        <input
                          type="text"
                          value={listingData.name}
                          onChange={(e) =>
                            setListingData({
                              ...listingData,
                              name: e.target.value,
                            })
                          }
                          placeholder="Give your dataset a descriptive name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={listingData.description}
                          onChange={(e) =>
                            setListingData({
                              ...listingData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe what this dataset contains and its potential use cases"
                          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={listingData.tags}
                          onChange={(e) =>
                            setListingData({
                              ...listingData,
                              tags: e.target.value,
                            })
                          }
                          placeholder="e.g. ecommerce, finance, healthcare (comma separated)"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <input
                            type="checkbox"
                            id="listOnMarketplace"
                            checked={listingData.listOnMarketplace}
                            onChange={(e) =>
                              setListingData({
                                ...listingData,
                                listOnMarketplace: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <label
                            htmlFor="listOnMarketplace"
                            className="text-sm font-medium text-gray-700"
                          >
                            List on Marketplace
                          </label>
                        </div>

                        {listingData.listOnMarketplace && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price (USDFC) *
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={listingData.price}
                                onChange={(e) =>
                                  setListingData({
                                    ...listingData,
                                    price: parseInt(e.target.value) || 1,
                                  })
                                }
                                className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              />
                              <span className="text-gray-500">USDFC</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Recommended: $1-10 USDFC for small datasets
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Dataset Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-2 capitalize font-medium">
                              {request.type}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Size:</span>
                            <span className="ml-2 font-medium">
                              {request.size} rows
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Model:</span>
                            <span className="ml-2 font-medium">
                              {
                                llmModels.find((m) => m.id === request.model)
                                  ?.name
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Columns:</span>
                            <span className="ml-2 font-medium">
                              {Object.keys(generatedData[0] || {}).length}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Upload Status Display */}
                      {status && (isGenerating || isUploading) && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 mb-2">{status}</p>
                          {(isGenerating || isUploading) && (
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload Success Info */}
                      {uploadedInfo && !isUploading && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-green-800">
                            Dataset Uploaded Successfully!
                          </h4>
                          <div className="text-sm text-green-700">
                            <div>
                              <span className="font-medium">File name:</span>{" "}
                              {uploadedInfo.fileName}
                            </div>
                            <div>
                              <span className="font-medium">File size:</span>{" "}
                              {uploadedInfo.fileSize?.toLocaleString() || "N/A"}{" "}
                              bytes
                            </div>
                            <div className="break-all">
                              <span className="font-medium">Piece CID:</span>{" "}
                              {uploadedInfo.pieceCid}
                            </div>
                            {uploadedInfo.txHash && (
                              <div className="break-all">
                                <span className="font-medium">Tx Hash:</span>{" "}
                                {uploadedInfo.txHash}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setStep(4)}>
                          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Preview
                        </Button>
                        <div className="flex gap-2">
                          {uploadedInfo && (
                            <Button
                              variant="outline"
                              onClick={resetUploadState}
                              disabled={isUploading}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Reset Upload
                            </Button>
                          )}
                          <Button
                            onClick={uploadDataset}
                            disabled={
                              !listingData.name ||
                              !listingData.description ||
                              isGenerating ||
                              isUploading
                            }
                          >
                            {isGenerating || isUploading ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                {isUploading ? "Uploading..." : "Saving..."}
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Save & Upload Dataset
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
