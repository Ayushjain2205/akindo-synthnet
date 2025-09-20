// components/StorageManager.tsx
"use client";

import { useAccount } from "wagmi";
import { useBalances } from "@/hooks/useBalances";
import { usePayment } from "@/hooks/usePayment";
import { config } from "@/config";
import { formatUnits } from "viem";
import { AllowanceItemProps, PaymentActionProps, SectionProps } from "@/types";

/**
 * Component to display and manage token payments for storage
 * Optimized with compact single-column redesign strategy
 */
export const StorageManager = () => {
  const { isConnected, chainId } = useAccount();
  const {
    data,
    isLoading: isBalanceLoading,
    refetch: refetchBalances,
  } = useBalances();
  const balances = data;
  const { mutation: paymentMutation, status } = usePayment();
  const { mutateAsync: handlePayment, isPending: isProcessingPayment } =
    paymentMutation;

  const handleRefetchBalances = async () => {
    await refetchBalances();
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <StorageBalanceHeader />

      {/* Compact Single-Column Layout */}
      <div className="mt-6 space-y-4">
        {/* Balances in pill style */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Wallet Balances</h4>
          <div className="flex flex-wrap gap-2">
            <BalancePill
              icon="💰"
              label="FIL"
              value={balances?.filBalanceFormatted?.toLocaleString() || "..."}
              isLoading={isBalanceLoading}
            />
            <BalancePill
              icon="💵"
              label="USDFC"
              value={balances?.usdfcBalanceFormatted?.toLocaleString() || "..."}
              isLoading={isBalanceLoading}
            />
            <BalancePill
              icon="🔥"
              label="Warm"
              value={
                balances?.warmStorageBalanceFormatted?.toLocaleString() || "..."
              }
              isLoading={isBalanceLoading}
            />
            <BalancePill
              icon="📦"
              label="Allowance"
              value={`${
                balances?.currentRateAllowanceGB?.toLocaleString() || "..."
              }GB`}
              isLoading={isBalanceLoading}
            />
          </div>
        </div>

        {/* Storage Usage as progress bar */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Storage Usage</h4>
          <StorageProgressBar
            current={balances?.currentStorageGB || 0}
            max={balances?.currentRateAllowanceGB || 0}
            isLoading={isBalanceLoading}
          />

          {/* Persistence Days as small subtext */}
          <div className="flex text-xs text-gray-600 gap-4">
            <span>
              ⏳ Max rate:{" "}
              {isBalanceLoading
                ? "..."
                : `${balances?.persistenceDaysLeft?.toFixed(1) || 0} days`}
            </span>
            <span>
              Current rate:{" "}
              {isBalanceLoading
                ? "..."
                : `${
                    balances?.persistenceDaysLeftAtCurrentRate?.toLocaleString() ||
                    0
                  } days`}
            </span>
          </div>
        </div>

        {/* Allowances as inline checkboxes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Allowances</h4>
          <div className="flex gap-4">
            <AllowanceCheckbox
              label="Rate"
              isSufficient={balances?.isRateSufficient}
              isLoading={isBalanceLoading}
            />
            <AllowanceCheckbox
              label="Lockup"
              isSufficient={balances?.isLockupSufficient}
              isLoading={isBalanceLoading}
            />
          </div>
        </div>

        {/* Action buttons */}
        <ActionSection
          balances={balances}
          isLoading={isBalanceLoading}
          isProcessingPayment={isProcessingPayment}
          onPayment={handlePayment}
          handleRefetchBalances={handleRefetchBalances}
        />

        {/* Status as small badge */}
        {status && (
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              status.includes("❌")
                ? "bg-red-100 text-red-800 border border-red-200"
                : status.includes("✅")
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Compact balance pill component
 */
const BalancePill = ({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: string;
  label: string;
  value: string;
  isLoading: boolean;
}) => (
  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
    <span>{icon}</span>
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

/**
 * Storage progress bar component with modern themed design
 */
const StorageProgressBar = ({
  current,
  max,
  isLoading,
}: {
  current: number;
  max: number;
  isLoading: boolean;
}) => {
  const availablePercentage =
    max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isLowAvailability = availablePercentage <= 20; // Less than 20% available
  const isCriticalAvailability = availablePercentage <= 5; // Less than 5% available

  return (
    <div className="space-y-2">
      {/* Progress Bar Container */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isCriticalAvailability
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : isLowAvailability
                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                : "bg-gradient-to-r from-green-500 to-green-600"
            }`}
            style={{ width: `${availablePercentage}%` }}
          >
            {/* Shine effect */}
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Percentage indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-xs font-bold ${
              isCriticalAvailability
                ? "text-red-700"
                : isLowAvailability
                ? "text-orange-700"
                : "text-green-700"
            }`}
          >
            {isLoading ? "..." : `${availablePercentage.toFixed(1)}%`}
          </span>
        </div>
      </div>

      {/* Storage info */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          {isLoading
            ? "Loading storage info..."
            : `${current.toLocaleString()}GB available / ${max.toLocaleString()}GB total`}
        </span>
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <div
            className={`w-2 h-2 rounded-full ${
              isCriticalAvailability
                ? "bg-red-500 animate-pulse"
                : isLowAvailability
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              isCriticalAvailability
                ? "text-red-600"
                : isLowAvailability
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {isCriticalAvailability
              ? "Critical"
              : isLowAvailability
              ? "Low Available"
              : "Plenty Available"}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Inline allowance checkbox component
 */
const AllowanceCheckbox = ({
  label,
  isSufficient,
  isLoading,
}: {
  label: string;
  isSufficient?: boolean;
  isLoading: boolean;
}) => (
  <div className="flex items-center gap-1 text-sm">
    <span
      className={`text-lg ${isSufficient ? "text-green-600" : "text-red-600"}`}
    >
      {isLoading ? "..." : isSufficient ? "✅" : "❌"}
    </span>
    <span className="font-medium text-gray-700">{label}</span>
  </div>
);

/**
 * Header section with title and USDFC faucet button
 */
const StorageBalanceHeader = () => {
  const { chainId } = useAccount();

  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Storage Balance</h3>
      </div>
      <div
        className={`flex items-center gap-2 ${
          chainId === 314159 ? "block" : "hidden"
        }`}
      >
        <button
          className="px-4 py-2 text-sm h-9 flex items-center justify-center rounded-lg border-2 border-black transition-all bg-black text-white hover:bg-white hover:text-black"
          onClick={() => {
            window.open(
              "https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc",
              "_blank"
            );
          }}
        >
          Get tUSDFC
        </button>
        <button
          className="px-4 py-2 text-sm h-9 flex items-center justify-center rounded-lg border-2 border-black transition-all bg-black text-white hover:bg-white hover:text-black"
          onClick={() => {
            window.open(
              "https://faucet.calibnet.chainsafe-fil.io/funds.html",
              "_blank"
            );
          }}
        >
          Get tFIL
        </button>
      </div>
    </div>
  );
};

/**
 * Section for payment actions
 */
const ActionSection = ({
  balances,
  isLoading,
  isProcessingPayment,
  onPayment,
  handleRefetchBalances,
}: PaymentActionProps) => {
  if (isLoading || !balances) return null;

  if (balances.isSufficient) {
    return (
      <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
        ✅ Sufficient for {config.storageCapacity}GB /{" "}
        {balances.persistenceDaysLeft.toFixed(1)} days
      </div>
    );
  }

  const depositNeededFormatted = Number(
    formatUnits(balances?.depositNeeded ?? 0n, 18)
  ).toFixed(3);

  if (balances.filBalance === 0n || balances.usdfcBalance === 0n) {
    return (
      <div className="space-y-2">
        {balances.filBalance === 0n && (
          <div className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium border border-red-200">
            ⚠️ Need FIL for transaction fees
          </div>
        )}
        {balances.usdfcBalance === 0n && (
          <div className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium border border-red-200">
            ⚠️ Need USDFC for storage
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {balances.isRateSufficient && !balances.isLockupSufficient && (
        <LockupIncreaseAction
          totalLockupNeeded={balances.totalLockupNeeded}
          depositNeeded={balances.depositNeeded}
          rateNeeded={balances.rateNeeded}
          isProcessingPayment={isProcessingPayment}
          onPayment={onPayment}
          handleRefetchBalances={handleRefetchBalances}
        />
      )}
      {!balances.isRateSufficient && balances.isLockupSufficient && (
        <RateIncreaseAction
          currentLockupAllowance={balances.currentLockupAllowance}
          rateNeeded={balances.rateNeeded}
          isProcessingPayment={isProcessingPayment}
          onPayment={onPayment}
          handleRefetchBalances={handleRefetchBalances}
        />
      )}
      {!balances.isRateSufficient && !balances.isLockupSufficient && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex flex-col gap-2">
          <p className="text-red-800">
            ⚠️ Your storage balance is insufficient. You need to deposit{" "}
            {depositNeededFormatted} USDFC & Increase your rate allowance to
            meet your storage needs.
          </p>
          <button
            onClick={async () => {
              await onPayment({
                lockupAllowance: balances.totalLockupNeeded,
                epochRateAllowance: balances.rateNeeded,
                depositAmount: balances.depositNeeded,
              });
              await handleRefetchBalances();
            }}
            disabled={isProcessingPayment}
            className={`w-full px-6 py-3 rounded-lg border-2 border-black transition-all ${
              isProcessingPayment
                ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-white hover:text-black"
            }`}
          >
            {isProcessingPayment
              ? "Processing transactions..."
              : "Deposit & Increase Allowances"}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Component for handling lockup deposit action
 */
const LockupIncreaseAction = ({
  totalLockupNeeded,
  depositNeeded,
  rateNeeded,
  isProcessingPayment,
  onPayment,
  handleRefetchBalances,
}: PaymentActionProps) => {
  if (!totalLockupNeeded || !depositNeeded || !rateNeeded) return null;

  const depositNeededFormatted = Number(
    formatUnits(depositNeeded ?? 0n, 18)
  ).toFixed(3);

  return (
    <>
      <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
        ⚠️ Additional USDFC needed: {depositNeededFormatted}
      </div>
      <button
        onClick={async () => {
          await onPayment({
            lockupAllowance: totalLockupNeeded,
            epochRateAllowance: rateNeeded,
            depositAmount: depositNeeded,
          });
          await handleRefetchBalances();
        }}
        disabled={isProcessingPayment}
        className={`w-full px-6 py-3 rounded-lg border-2 border-black transition-all ${
          isProcessingPayment
            ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-white hover:text-black"
        }`}
      >
        {isProcessingPayment
          ? "Processing transactions..."
          : "Deposit & Increase Lockup"}
      </button>
    </>
  );
};

/**
 * Component for handling rate deposit action
 */
const RateIncreaseAction = ({
  currentLockupAllowance,
  rateNeeded,
  isProcessingPayment,
  onPayment,
  handleRefetchBalances,
}: PaymentActionProps) => {
  if (!currentLockupAllowance || !rateNeeded) return null;

  return (
    <>
      <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
        ⚠️ Increase rate allowance needed
      </div>
      <button
        onClick={async () => {
          await onPayment({
            lockupAllowance: currentLockupAllowance,
            epochRateAllowance: rateNeeded,
            depositAmount: 0n,
          });
          await handleRefetchBalances();
        }}
        disabled={isProcessingPayment}
        className={`w-full px-6 py-3 rounded-lg border-2 border-black transition-all ${
          isProcessingPayment
            ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-white hover:text-black"
        }`}
      >
        {isProcessingPayment ? "Increasing Rate..." : "Increase Rate"}
      </button>
    </>
  );
};
