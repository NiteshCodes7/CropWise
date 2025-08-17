import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sprout,
  Zap,
  Droplets,
  Recycle,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  BookOpen,
  Clock,
  Award,
  Users,
  ChevronRight,
  Play,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";

const FarmingTipsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedTip, setExpandedTip] = useState(null);
  const { t } = useTranslation("farmingTips");

  const categories = [
    { id: "all", label: "All Tips", icon: BookOpen },
    { id: "fertilizer", label: "Fertilizer Efficiency", icon: Zap },
    { id: "sustainable", label: "Sustainable Farming", icon: Recycle },
    { id: "technology", label: "Modern Technology", icon: Target },
    { id: "water", label: "Water Management", icon: Droplets },
    { id: "soil", label: "Soil Health", icon: Sprout },
  ];

  const farmingTips = [
    {
      id: 1,
      category: "fertilizer",
      title: t("farmingTips.0.title"),
    level: t("farmingTips.0.level"),
    readTime: t("farmingTips.0.readTime"),
    summary: t("farmingTips.0.summary"),
    description: t("farmingTips.0.description"),
      benefits: t("farmingTips.0.benefits", { returnObjects: true }),
      steps: t("farmingTips.0.steps", { returnObjects: true }),
      tools: t("farmingTips.0.tools", { returnObjects: true }),
    },
    {
      id: 2,
      category: "fertilizer",
      title: t("farmingTips.1.title"),
    level: t("farmingTips.1.level"),
    readTime: t("farmingTips.1.readTime"),
    summary: t("farmingTips.1.summary"),
    description: t("farmingTips.1.description"),
      benefits: t("farmingTips.1.benefits", { returnObjects: true }),
      steps: t("farmingTips.1.steps", { returnObjects: true }),
      tools: t("farmingTips.1.tools", { returnObjects: true }),
    },
    {
      id: 3,
      category: "sustainable",
      title: t("farmingTips.2.title"),
    level: t("farmingTips.2.level"),
    readTime: t("farmingTips.2.readTime"),
    summary: t("farmingTips.2.summary"),
    description: t("farmingTips.2.description"),
      benefits: t("farmingTips.2.benefits", { returnObjects: true }),
      steps: t("farmingTips.2.steps", { returnObjects: true }),
      tools: t("farmingTips.2.tools", { returnObjects: true }),
    },
    {
      id: 4,
      category: "technology",
      title: t("farmingTips.3.title"),
    level: t("farmingTips.3.level"),
    readTime: t("farmingTips.3.readTime"),
    summary: t("farmingTips.3.summary"),
    description: t("farmingTips.3.description"),
      benefits: t("farmingTips.3.benefits", { returnObjects: true }),
      steps: t("farmingTips.3.steps", { returnObjects: true }),
      tools: t("farmingTips.3.tools", { returnObjects: true }),
    },
    {
      id: 5,
      category: "water",
      title: t("farmingTips.4.title"),
    level: t("farmingTips.4.level"),
    readTime: t("farmingTips.4.readTime"),
    summary: t("farmingTips.4.summary"),
    description: t("farmingTips.4.description"),
      benefits: t("farmingTips.4.benefits", { returnObjects: true }),
      steps: t("farmingTips.4.steps", { returnObjects: true }),
      tools: t("farmingTips.4.tools", { returnObjects: true }),
    },
    {
      id: 6,
      category: "soil",
      title: t("farmingTips.5.title"),
    level: t("farmingTips.5.level"),
    readTime: t("farmingTips.5.readTime"),
    summary: t("farmingTips.5.summary"),
    description: t("farmingTips.5.description"),
      benefits: t("farmingTips.5.benefits", { returnObjects: true }),
      steps: t("farmingTips.5.steps", { returnObjects: true }),
      tools: t("farmingTips.5.tools", { returnObjects: true }),
    },
    {
      id: 7,
      category: "technology",
      title: t("farmingTips.6.title"),
    level: t("farmingTips.6.level"),
    readTime: t("farmingTips.6.readTime"),
    summary: t("farmingTips.6.summary"),
    description: t("farmingTips.6.description"),
      benefits: t("farmingTips.6.benefits", { returnObjects: true }),
      steps: t("farmingTips.6.steps", { returnObjects: true }),
      tools: t("farmingTips.6.tools", { returnObjects: true }),
    },
    {
      id: 8,
      category: "sustainable",
      title: t("farmingTips.7.title"),
    level: t("farmingTips.7.level"),
    readTime: t("farmingTips.7.readTime"),
    summary: t("farmingTips.7.summary"),
    description: t("farmingTips.7.description"),
      benefits: t("farmingTips.7.benefits", { returnObjects: true }),
      steps: t("farmingTips.7.steps", { returnObjects: true }),
      tools: t("farmingTips.7.tools", { returnObjects: true }),
    },
  ];

  const filteredTips =
    selectedCategory === "all"
      ? farmingTips
      : farmingTips.filter((tip) => tip.category === selectedCategory);

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find((c) => c.id === category);
    return cat.icon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-green-700 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg text-center">
            <CardContent className="p-4">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {farmingTips.length}
              </div>
              <div className="text-sm text-green-600">{t("stats.tips")}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">30%</div>
              <div className="text-sm text-green-600">{t("stats.efficiency")}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">10K+</div>
              <div className="text-sm text-green-600">{t("stats.farmers")}</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg text-center">
            <CardContent className="p-4">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">100%</div>
              <div className="text-sm text-green-600">{t("stats.science")}</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              {t("categoryHeader")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "border-green-600 text-green-600 hover:bg-green-50"
                    } cursor-pointer`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {t(`categories.${category.id}`)}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => {
            const CategoryIcon = getCategoryIcon(tip.category);
            const isExpanded = expandedTip === tip.id;

            return (
              <Card
                key={tip.id}
                className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <CategoryIcon className="w-6 h-6 text-green-600" />
                    <div className="flex gap-2">
                      <Badge className={getLevelColor(tip.level)}>
                        {tip.level}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-green-900 leading-tight">
                    {tip.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-green-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {tip.readTime}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-green-700 text-sm leading-relaxed">
                    {tip.summary}
                  </p>

                  {isExpanded && (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          {t("Description")}
                        </h4>
                        <p className="text-green-700 text-sm">
                          {tip.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          {t("Key Benefits")}
                        </h4>
                        <ul className="space-y-1">
                          {tip.benefits.map((benefit, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm text-green-700"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          {t("Implementation Steps")}
                        </h4>
                        <ol className="space-y-1">
                          {tip.steps.map((step, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm text-green-700"
                            >
                              <span className="w-5 h-5 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-semibold mr-2 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          {t("Required Tools")}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {tip.tools.map((tool, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    {isExpanded ? t("showLess") : t("learnMore")}
                    <ChevronRight
                      className={`w-4 h-4 ml-1 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg mt-8">
          <CardContent className="p-8 text-center">
            <Lightbulb className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-900 mb-2">
              {t("cta.title")}
            </h3>
            <p className="text-green-700 mb-6 max-w-2xl mx-auto">
              {t("cta.desc")}
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              {t("cta.button")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmingTipsPage;
