import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { getPetById } from "~/lib/storage";
import { formatDate, calculateDays, formatDays } from "~/lib/date-utils";
import { ArrowLeft, Fish, Turtle, Calendar, MapPin, Tag, Store, Heart } from "lucide-react";

export default function FishDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const foundPet = getPetById(id);
    if (!foundPet) {
      navigate("/list");
      return;
    }
    setPet(foundPet);
  }, [id, navigate]);

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  const days = pet.isDead && pet.deathDate 
    ? calculateDays(pet.deathDate) 
    : calculateDays(pet.arrivalDate);
  const getCategoryIcon = (category) => {
    return category === "鱼类" ? (
      <Fish className="h-6 w-6" />
    ) : (
      <Turtle className="h-6 w-6" />
    );
  };

  const getSourceLabel = (source) => {
    const labels = {
      购买: "购买",
      繁殖: "繁殖",
      赠送: "赠送",
      野采: "野采",
    };
    return labels[source] || source;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => navigate("/list")}
          className="mb-4 pl-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Button>

        <Card>
          {/* 大图展示区域 */}
          <div className="relative w-full aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
            {pet.image ? (
              <>
                <img
                  src={pet.image}
                  alt={pet.name}
                  className={`w-full h-full object-cover ${
                    pet.isDead ? "grayscale opacity-60" : ""
                  }`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
                {pet.isDead && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="text-6xl">💀</div>
                  </div>
                )}
              </>
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${
                pet.isDead ? "bg-gray-300" : "bg-blue-100"
              }`}>
                <div className={`${pet.isDead ? "text-gray-600" : "text-blue-600"}`}>
                  {/* {getCategoryIcon(pet.category)} */}
                  <div className="text-6xl">
                    {pet.category === "鱼类" ? "🐟" : "🐢"}
                  </div>
                </div>
              </div>
            )}
          </div>

          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <CardTitle className={`text-3xl ${pet.isDead ? "text-gray-500 line-through" : ""}`}>
                    {pet.name}
                  </CardTitle>
                  {pet.isDead && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      已故
                    </span>
                  )}
                  {pet.isReleased && !pet.isDead && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      已放生
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    pet.isDead 
                      ? "bg-gray-200 text-gray-600" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {pet.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    pet.isDead 
                      ? "bg-gray-200 text-gray-600" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {pet.breed}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    pet.isDead 
                      ? "bg-gray-200 text-gray-600" 
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {getSourceLabel(pet.source)}
                  </span>
                  {pet.source === "购买" && pet.price && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      pet.isDead 
                        ? "bg-gray-200 text-gray-600" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      ¥{parseFloat(pet.price).toFixed(2)}
                    </span>
                  )}
                  {pet.source === "购买" && pet.purchaseLocation && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      pet.isDead 
                        ? "bg-gray-200 text-gray-600" 
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {pet.purchaseLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-500">到家时间</div>
                  <div className="font-medium">{formatDate(pet.arrivalDate)}</div>
                </div>
              </div>
              {pet.isDead && pet.deathDate ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-sm text-gray-500">死亡时间</div>
                    <div className="font-medium text-red-600">{formatDate(pet.deathDate)}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-500">陪伴时间</div>
                    <div className="font-medium text-blue-600">{formatDays(days)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* 产卵日期 */}
            {pet.spawnDates && pet.spawnDates.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">产卵记录</h3>
                <div className="space-y-2">
                  {pet.spawnDates.map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
                    >
                      <Calendar className="h-4 w-4 text-yellow-600" />
                      <span>{formatDate(date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 生病记录 */}
            {pet.illnesses && pet.illnesses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">生病记录</h3>
                <div className="space-y-2">
                  {pet.illnesses.map((illness, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
                    >
                      <span className="text-red-600">⚠️</span>
                      <span>{illness}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

