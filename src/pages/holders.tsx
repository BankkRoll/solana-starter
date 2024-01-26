import { Card, CardContent } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface Holder {
  address: string;
  amount: number;
}

const Holders = () => {
  const [creatorAddress, setCreatorAddress] = useState("");
  const [holders, setHolders] = useState<Holder[]>([]);
  const [activeTab, setActiveTab] = useState("csv");

  const saveToFile = (data: BlobPart, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    saveAs(blob, filename);
  };

  const handleSaveCSV = () => {
    if (!csvData) {
      toast.error("No CSV data to save.");
      return;
    }
    saveToFile(csvData, "holders.csv", "text/csv;charset=utf-8;");
  };

  const handleSaveJSON = () => {
    if (!jsonData) {
      toast.error("No JSON data to save.");
      return;
    }
    saveToFile(jsonData, "holders.json", "application/json;charset=utf-8;");
  };

  const handleDownload = () => {
    if (activeTab === "csv") {
      handleSaveCSV();
    } else if (activeTab === "json") {
      handleSaveJSON();
    }
  };

  const handleSearch = () => {
    if (!creatorAddress) {
      toast.error("Please enter a query.");
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/snapshot/${creatorAddress}`, {
        method: "GET",
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Address not found.");
        } else {
          throw new Error("An unexpected error occurred.");
        }
      }
      return response.json();
    };

    toast.promise(fetchData(), {
      loading: "Fetching Mintlist & Converting To Holders...",
      success: (data) => {
        setHolders(processHoldersData(data));
        return "Data fetched successfully.";
      },
      error: (err) => err.message,
    });
  };

  const processHoldersData = (responseData: any[]) => {
    const holdersMap = new Map();

    responseData.forEach((asset: { ownership: { owner: any } }) => {
      const ownerAddress = asset.ownership.owner;
      if (holdersMap.has(ownerAddress)) {
        holdersMap.set(ownerAddress, holdersMap.get(ownerAddress) + 1);
      } else {
        holdersMap.set(ownerAddress, 1);
      }
    });

    return Array.from(holdersMap)
      .map(([address, amount]) => ({ address, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const csvData = useMemo(() => {
    if (!holders.length) return "";
    const headers = "Address,Amount\n";
    const rows = holders.map((h) => `${h.address},${h.amount}`).join("\n");
    return headers + rows;
  }, [holders]);

  const jsonData = useMemo(() => {
    if (!holders.length) return "";
    return JSON.stringify(holders, null, 2);
  }, [holders]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col justify-center items-center mx-auto gap-4 max-sm:w-full px-4">
        <div className="flex flex-row justify-center items-center mx-auto gap-4">
          <Input
            className="border p-2 rounded-md  min-w-full md:min-w-96"
            type="text"
            placeholder="Enter Creator Address"
            value={creatorAddress}
            onChange={(e) => setCreatorAddress(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="w-full">
          <Tabs defaultValue="csv" className="w-full">
            <TabsList className="flex justify-center">
              <TabsTrigger
                onClick={() => setActiveTab("csv")}
                value="csv"
                className="mx-2"
              >
                CSV
              </TabsTrigger>
              <TabsTrigger
                onClick={() => setActiveTab("json")}
                value="json"
                className="mx-2"
              >
                JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv">
              <Card>
                <CardContent className="overflow-y-auto h-96 p-4 rounded-lg">
                  {!csvData && (
                    <div className="flex justify-center items-center m-auto">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        <p className="mt-3 text-lg text-gray-600">
                          Enter a search query
                        </p>
                      </div>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-mono text-left">
                    {csvData}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="json">
              <Card>
                <CardContent className="overflow-y-auto h-96 p-4 rounded-lg">
                  {!csvData && (
                    <div className="flex justify-center items-center m-auto">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        <p className="mt-3 text-lg text-gray-600">
                          Enter a search query
                        </p>
                      </div>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-mono text-left">
                    {jsonData}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-row justify-center items-center mx-auto gap-4">
          <Button disabled={!csvData} onClick={handleDownload}>
            Download {activeTab.toUpperCase()}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Holders;
