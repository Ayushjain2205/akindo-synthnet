// components/DatasetsViewer.tsx
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useDatasets } from "@/hooks/useDatasets";
import { useDownloadPiece } from "@/hooks/useDownloadPiece";
import { DataSet } from "@/types";
import { DataSetPieceData } from "@filoz/synapse-sdk";

export const DatasetsViewer = () => {
  const { isConnected } = useAccount();
  const { data, isLoading: isLoadingDatasets } = useDatasets();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Datasets</h3>
        </div>
      </div>

      {isLoadingDatasets ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            <p className="text-gray-500">Loading datasets...</p>
          </div>
        </div>
      ) : data && data.datasets && data.datasets.length > 0 ? (
        <div className="mt-6 space-y-4">
          {data.datasets.map(
            (dataset: DataSet | undefined) =>
              dataset && (
                <DatasetCard key={dataset.clientDataSetId} dataset={dataset} />
              )
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-gray-500">No datasets found</p>
            <p className="text-sm text-gray-400 mt-1">
              Upload files to create your first dataset
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Minimal dataset card component
 */
const DatasetCard = ({ dataset }: { dataset: DataSet }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
      {/* Dataset Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">
              {dataset.pdpVerifierDataSetId}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              Dataset #{dataset.pdpVerifierDataSetId}
            </h4>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <StatusBadge isLive={dataset.isLive} />
              <span>{dataset.currentPieceCount} pieces</span>
              {dataset.withCDN && (
                <span className="text-green-600">⚡ CDN</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {isExpanded ? "Hide" : "Show"} Details
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* Quick Stats - Hidden as requested */}
          {/* <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Commission:</span>
              <span className="font-medium">
                {dataset.commissionBps / 100}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Managed:</span>
              <span className="font-medium">
                {dataset.isManaged ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Next ID:</span>
              <span className="font-medium">{dataset.nextPieceId}</span>
            </div>
            {dataset.data?.nextChallengeEpoch && (
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Next Challenge:</span>
                <span className="font-medium">
                  Epoch {dataset.data.nextChallengeEpoch}
                </span>
              </div>
            )}
          </div> */}

          {/* PDP URL */}
          {dataset.provider?.products.PDP?.data.serviceURL && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">PDP URL:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      dataset.provider?.products.PDP?.data.serviceURL || ""
                    );
                    // Simple feedback without alert
                    const btn = event?.target as HTMLButtonElement;
                    const originalText = btn.textContent;
                    btn.textContent = "Copied!";
                    setTimeout(() => (btn.textContent = originalText), 1000);
                  }}
                  className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-mono truncate">
                {dataset.provider.products.PDP.data.serviceURL}
              </p>
            </div>
          )}

          {/* Pieces */}
          {dataset.data?.pieces && dataset.data.pieces.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">
                Available Pieces ({dataset.data.pieces.length})
              </h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dataset.data.pieces.map((piece) => (
                  <PieceCard key={piece.pieceId} piece={piece} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Status badge component
 */
const StatusBadge = ({ isLive }: { isLive: boolean }) => (
  <div
    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      isLive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    <div
      className={`w-1.5 h-1.5 rounded-full ${
        isLive ? "bg-green-500" : "bg-red-500"
      }`}
    />
    {isLive ? "Live" : "Inactive"}
  </div>
);

/**
 * Minimal piece card component
 */
const PieceCard = ({ piece }: { piece: DataSetPieceData }) => {
  const { downloadMutation } = useDownloadPiece(
    piece.pieceCid.toString(),
    `piece-${piece.pieceCid}.png`
  );

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-blue-600">
            {piece.pieceId}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            Piece #{piece.pieceId}
          </p>
          <p className="text-xs text-gray-500 truncate font-mono">
            {piece.pieceCid.toString().slice(0, 20)}...
          </p>
        </div>
      </div>

      <button
        onClick={() => downloadMutation.mutate()}
        disabled={downloadMutation.isPending}
        className={`px-3 py-1 text-xs rounded-lg border transition-all flex-shrink-0 ${
          downloadMutation.isPending
            ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white border-black text-black hover:bg-black hover:text-white"
        }`}
      >
        {downloadMutation.isPending ? (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span>Downloading...</span>
          </div>
        ) : (
          "Download"
        )}
      </button>
    </div>
  );
};
