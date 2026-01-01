import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { getPetById, updatePet } from "~/lib/storage";
import { Plus, X } from "lucide-react";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    source: "",
    name: "",
    breed: "",
    arrivalDate: new Date().toISOString().split("T")[0],
    price: "",
    purchaseLocation: "",
    image: "",
    isDead: false,
    deathDate: "",
    spawnDates: [],
    illnesses: [],
  });

  const [newSpawnDate, setNewSpawnDate] = useState("");
  const [newIllness, setNewIllness] = useState("");

  useEffect(() => {
    const pet = getPetById(id);
    if (!pet) {
      navigate("/list");
      return;
    }
    setFormData({
      category: pet.category || "",
      source: pet.source || "",
      name: pet.name || "",
      breed: pet.breed || "",
      arrivalDate: pet.arrivalDate ? pet.arrivalDate.split("T")[0] : new Date().toISOString().split("T")[0],
      price: pet.price || "",
      purchaseLocation: pet.purchaseLocation || "",
      image: pet.image || "",
      isDead: pet.isDead || false,
      deathDate: pet.deathDate ? pet.deathDate.split("T")[0] : "",
      spawnDates: pet.spawnDates || [],
      illnesses: pet.illnesses || [],
    });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.source || !formData.name || !formData.breed) {
      alert("请填写所有必填项");
      return;
    }

    const updatedPet = {
      ...formData,
      arrivalDate: formData.arrivalDate || new Date().toISOString(),
    };

    updatePet(id, updatedPet);
    alert("更新成功！");
    navigate(`/fish/${id}`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        alert("请选择图片文件");
      }
    }
  };

  const addSpawnDate = () => {
    if (newSpawnDate) {
      setFormData({
        ...formData,
        spawnDates: [...formData.spawnDates, newSpawnDate],
      });
      setNewSpawnDate("");
    }
  };

  const removeSpawnDate = (index) => {
    setFormData({
      ...formData,
      spawnDates: formData.spawnDates.filter((_, i) => i !== index),
    });
  };

  const addIllness = () => {
    if (newIllness) {
      setFormData({
        ...formData,
        illnesses: [...formData.illnesses, newIllness],
      });
      setNewIllness("");
    }
  };

  const removeIllness = (index) => {
    setFormData({
      ...formData,
      illnesses: formData.illnesses.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>修改宠物信息</CardTitle>
              <Button
                variant="ghost"
                onClick={() => navigate(`/fish/${id}`)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 分类 */}
              <div>
                <label className="block text-sm font-medium mb-2">分类 *</label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.category === "鱼类" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, category: "鱼类" })}
                    className="flex-1"
                  >
                    鱼类
                  </Button>
                  <Button
                    type="button"
                    variant={formData.category === "龟类" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, category: "龟类" })}
                    className="flex-1"
                  >
                    龟类
                  </Button>
                </div>
              </div>

              {/* 获取渠道 */}
              <div>
                <label className="block text-sm font-medium mb-2">获取渠道 *</label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.source === "购买" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, source: "购买" })}
                  >
                    购买
                  </Button>
                  <Button
                    type="button"
                    variant={formData.source === "繁殖" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, source: "繁殖", price: "", purchaseLocation: "" })}
                  >
                    繁殖
                  </Button>
                  <Button
                    type="button"
                    variant={formData.source === "赠送" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, source: "赠送", price: "", purchaseLocation: "" })}
                  >
                    赠送
                  </Button>
                  <Button
                    type="button"
                    variant={formData.source === "野采" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, source: "野采", price: "", purchaseLocation: "" })}
                  >
                    野采
                  </Button>
                </div>
              </div>

              {/* 购买相关信息 - 仅在选择购买时显示 */}
              {formData.source === "购买" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">购买金额（元）</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="请输入购买金额"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">从哪里购买</label>
                    <Input
                      value={formData.purchaseLocation}
                      onChange={(e) => setFormData({ ...formData, purchaseLocation: e.target.value })}
                      placeholder="请输入购买地点或商家名称"
                    />
                  </div>
                </>
              )}

              {/* 头像 */}
              <div>
                <label className="block text-sm font-medium mb-2">头像</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="请输入图片URL"
                    />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <span className="text-sm text-blue-600 hover:text-blue-700">或选择本地图片</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {formData.image && (
                    <div className="shrink-0">
                      <img
                        src={formData.image}
                        alt="头像预览"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 昵称 */}
              <div>
                <label className="block text-sm font-medium mb-2">昵称 *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入宠物昵称"
                />
              </div>

              {/* 品种 */}
              <div>
                <label className="block text-sm font-medium mb-2">品种 *</label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="请输入品种"
                />
              </div>

              {/* 到家时间 */}
              <div>
                <label className="block text-sm font-medium mb-2">到家时间</label>
                <Input
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                />
              </div>

              {/* 死亡日期 - 仅在标记为已故时显示 */}
              {formData.isDead && (
                <div>
                  <label className="block text-sm font-medium mb-2">死亡日期</label>
                  <Input
                    type="date"
                    value={formData.deathDate}
                    onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                  />
                </div>
              )}

              {/* 产卵日期 */}
              <div>
                <label className="block text-sm font-medium mb-2">产卵日期</label>
                <div className="flex gap-2 mb-2 items-center">
                  <Input
                    type="date"
                    value={newSpawnDate}
                    onChange={(e) => setNewSpawnDate(e.target.value)}
                    placeholder="选择产卵日期"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addSpawnDate} className="shrink-0 whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    添加
                  </Button>
                </div>
                {formData.spawnDates.length > 0 && (
                  <div className="space-y-2">
                    {formData.spawnDates.map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>{date}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpawnDate(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 生病记录 */}
              <div>
                <label className="block text-sm font-medium mb-2">生病记录</label>
                <div className="flex gap-2 mb-2 items-center">
                  <Input
                    value={newIllness}
                    onChange={(e) => setNewIllness(e.target.value)}
                    placeholder="请输入生病记录"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addIllness} className="shrink-0 whitespace-nowrap">
                    <Plus className="h-4 w-4 mr-2" />
                    添加
                  </Button>
                </div>
                {formData.illnesses.length > 0 && (
                  <div className="space-y-2">
                    {formData.illnesses.map((illness, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>{illness}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIllness(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  保存修改
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/fish/${id}`)}
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

