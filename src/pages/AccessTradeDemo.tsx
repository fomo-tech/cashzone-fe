import React, { useState } from "react";
import {
  Play,
  Zap,
  Database,
  Calendar,
  Tag,
  DollarSign,
  Loader,
} from "lucide-react";
import accessTradeDemo from "@/services/accesstrade-demo";

interface ApiResult {
  success: boolean;
  data?: any;
  error?: any;
  status?: number;
}

const AccessTradeDemoPage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, ApiResult>>({});

  const handleApiCall = async (
    testName: string,
    apiCall: () => Promise<ApiResult>
  ) => {
    setLoading(testName);
    try {
      const result = await apiCall();
      setResults((prev) => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [testName]: {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  const renderResult = (testName: string) => {
    const result = results[testName];
    if (!result) return null;

    return (
      <div className="mt-4 p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {result.success ? (
            <div className="flex items-center gap-1 text-[#E91E63]">
              <div className="w-2 h-2 bg-[#E91E63] rounded-full"></div>
              <span className="text-sm font-medium">Success</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Error</span>
            </div>
          )}
          {result.status && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
              HTTP {result.status}
            </span>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded text-sm">
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(
              result.success ? result.data : result.error,
              null,
              2
            )}
          </pre>
        </div>
      </div>
    );
  };

  const tests = [
    {
      name: "quickTest",
      title: "Quick Connection Test",
      description: "Test API connection with campaigns endpoint",
      icon: Zap,
      color: "bg-[#E91E63]",
      action: () => accessTradeDemo.quickTest(),
    },
    {
      name: "campaigns",
      title: "Get Campaigns",
      description: "Fetch list of available campaigns",
      icon: Play,
      color: "bg-[#E91E63]",
      action: () => accessTradeDemo.getCampaigns({ limit: 5 }),
    },
    {
      name: "categories",
      title: "Get Categories",
      description: "Fetch product categories",
      icon: Tag,
      color: "bg-purple-500",
      action: () => accessTradeDemo.getCategories(),
    },
    {
      name: "offers",
      title: "Get Offers",
      description: "Fetch available offers/products",
      icon: Database,
      color: "bg-orange-500",
      action: () => accessTradeDemo.getOffers({ limit: 5 }),
    },
    {
      name: "transactions",
      title: "Get Transactions",
      description: "Fetch commission transactions",
      icon: DollarSign,
      color: "bg-pink-500",
      action: () => accessTradeDemo.getTransactions({ limit: 5 }),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AccessTrade API Demo
          </h1>
          <p className="text-gray-600">
            Test integration with AccessTrade API endpoints
          </p>
          <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-200">
            <p className="text-sm text-blue-800">
              <strong>API Base:</strong> https://api.accesstrade.vn
              <br />
              <strong>Authorization:</strong> Token jFogCAEIT6...VI
              <br />
              <strong>Content-Type:</strong> application/json
            </p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {tests.map((test) => {
            const Icon = test.icon;
            const isLoading = loading === test.name;

            return (
              <div key={test.name} className="bg-white rounded-lg shadow-md">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 ${test.color} rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      {test.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {test.description}
                  </p>

                  <button
                    onClick={() => handleApiCall(test.name, test.action)}
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Testing...
                      </span>
                    ) : (
                      "Run Test"
                    )}
                  </button>
                </div>

                {renderResult(test.name)}
              </div>
            );
          })}
        </div>

        {/* Run All Tests */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Full API Demo
              </h2>
              <p className="text-gray-600">Run all API tests sequentially</p>
            </div>

            <button
              onClick={() =>
                handleApiCall("fullDemo", accessTradeDemo.runFullDemo)
              }
              disabled={loading === "fullDemo"}
              className={`py-3 px-6 rounded-lg font-medium transition-colors ${
                loading === "fullDemo"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-[#AD1457]"
              }`}
            >
              {loading === "fullDemo" ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Running Full Demo...
                </span>
              ) : (
                "Run Full Demo"
              )}
            </button>
          </div>

          {renderResult("fullDemo")}
        </div>
      </div>
    </div>
  );
};

export default AccessTradeDemoPage;
