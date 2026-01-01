import { useEffect, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { getAllPets, updatePet, deletePet } from "~/lib/storage";
import { formatDate, calculateDays, formatDays } from "~/lib/date-utils";
import { Plus, Fish, Turtle, Edit, Heart, Trash2, Waves } from "lucide-react";

export default function ListPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [petToRelease, setPetToRelease] = useState(null);

  const loadPets = () => {
    setPets(getAllPets());
  };

  useEffect(() => {
    loadPets();
    // 监听 storage 变化，以便在其他标签页修改后也能更新
    const handleStorageChange = () => {
      loadPets();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getCategoryIcon = (category) => {
    return category === "鱼类" ? (
      <Fish className="h-5 w-5" />
    ) : (
      <Turtle className="h-5 w-5" />
    );
  };

  const toggleDeathStatus = (pet, e) => {
    e.preventDefault();
    e.stopPropagation();
    const isDead = pet.isDead;
    const deathDate = isDead ? "" : new Date().toISOString().split("T")[0];
    updatePet(pet.id, { isDead: !isDead, deathDate });
    loadPets();
  };

  const handleDeleteClick = (pet, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPetToDelete(pet);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (petToDelete) {
      deletePet(petToDelete.id);
      loadPets();
      setDeleteDialogOpen(false);
      setPetToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPetToDelete(null);
  };

  const handleReleaseClick = (pet, e) => {
    e.preventDefault();
    e.stopPropagation();
    setPetToRelease(pet);
    setReleaseDialogOpen(true);
  };

  const handleReleaseConfirm = () => {
    if (petToRelease) {
      updatePet(petToRelease.id, {
        isReleased: true,
        releaseDate: new Date().toISOString().split("T")[0],
      });
      loadPets();
      setReleaseDialogOpen(false);
      setPetToRelease(null);
    }
  };

  const handleReleaseCancel = () => {
    setReleaseDialogOpen(false);
    setPetToRelease(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">我的宠物</h1>
          <Button onClick={() => navigate("/")}>
            <Plus className="h-4 w-4 mr-2" />
            添加宠物
          </Button>
        </div>

        {pets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">还没有任何宠物记录</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pets.map((pet) => {
              const days = pet.isDead && pet.deathDate 
                ? calculateDays(pet.deathDate) 
                : pet.isReleased && pet.releaseDate
                ? calculateDays(pet.releaseDate)
                : calculateDays(pet.arrivalDate);
              return (
                <div key={pet.id} className="relative">
                  <Link to={`/fish/${pet.id}`}>
                    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${
                      pet.isDead ? "opacity-60 bg-gray-100" : pet.isReleased ? "opacity-60 bg-green-50" : ""
                    }`}>
                      <CardContent className="p-6" style={{ paddingRight: "calc(2rem + 32px + 20px)" }}>
                        <div className="flex items-start gap-4">
                          {/* 头像 */}
                          <div className="shrink-0 relative">
                            {pet.image ? (
                              <img
                                src={pet.image}
                                alt={pet.name}
                                className={`w-16 h-16 rounded-full object-cover border-2 ${
                                  pet.isDead ? "border-gray-400 grayscale" : "border-gray-200"
                                }`}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "";
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                pet.isDead ? "bg-gray-300 text-gray-600" : "bg-blue-100 text-blue-600"
                              }`}>
                                {getCategoryIcon(pet.category)}
                              </div>
                            )}
                            {pet.isDead && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-2xl"></div>
                              </div>
                            )}
                          </div>

                          {/* 信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className={`text-xl font-semibold truncate ${
                                  pet.isDead ? "text-gray-500 line-through" : pet.isReleased ? "text-green-600" : ""
                                }`}>
                                  {pet.name}
                                </h3>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                {pet.isDead && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs whitespace-nowrap">
                                    已故
                                  </span>
                                )}
                                {pet.isReleased && !pet.isDead && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs whitespace-nowrap">
                                    已放生
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <span>到家时间：</span>
                                <span>{formatDate(pet.arrivalDate)}</span>
                              </div>
                              {pet.isDead && pet.deathDate ? (
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                  <span>死亡时间：</span>
                                  <span className="text-red-600">{formatDate(pet.deathDate)}</span>
                                </div>
                              ) : pet.isReleased && pet.releaseDate ? (
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                  <span>放生时间：</span>
                                  <span className="text-green-600">{formatDate(pet.releaseDate)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                  <span>陪伴时间：</span>
                                  <span className="text-blue-600 font-medium">
                                    {formatDays(days)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                pet.isDead 
                                  ? "bg-gray-200 text-gray-600" 
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {pet.category}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                pet.isDead 
                                  ? "bg-gray-200 text-gray-600" 
                                  : "bg-green-100 text-green-700"
                              }`}>
                                {pet.breed}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  {/* 操作按钮 */}
                  <div className="absolute top-3 right-5 flex flex-col gap-1.5">
                    <Button
                      variant={pet.isDead ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => toggleDeathStatus(pet, e)}
                      className={`${
                        pet.isDead
                          ? "bg-red-600 hover:bg-red-700 border-red-600 text-white"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 bg-white"
                      } w-8 h-8 p-0`}
                      title={pet.isDead ? "标记为存活" : "标记为死亡"}
                    >
                      <Heart className={`h-4 w-4 ${pet.isDead ? "fill-white" : ""}`} />
                    </Button>
                    
                    {!pet.isReleased && !pet.isDead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleReleaseClick(pet, e)}
                        className="border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 bg-white w-8 h-8 p-0"
                        title="放生"
                      >
                        <Waves className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleDeleteClick(pet, e)}
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 bg-white w-8 h-8 p-0"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/edit/${pet.id}`);
                      }}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 bg-white w-8 h-8 p-0"
                      title="编辑"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 删除确认对话框 */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
              <DialogDescription>
                确定要删除宠物"{petToDelete?.name}"吗？此操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleDeleteCancel}>
                取消
              </Button>
              <Button
                variant="default"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 放生确认对话框 */}
        <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认放生</DialogTitle>
              <DialogDescription>
                确定要放生宠物"{petToRelease?.name}"吗？放生后宠物将标记为已放生状态。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleReleaseCancel}>
                取消
              </Button>
              <Button
                variant="default"
                onClick={handleReleaseConfirm}
                className="bg-green-600 hover:bg-green-700"
              >
                确认放生
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

