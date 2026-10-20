import { create } from "zustand";

interface orderImages {
  total_order_images: number;
  total_article_images: number;
  total_analysis: number;
  updateOrderImagesTotal: (newCount: number) => void;
  updateArticleImagesTotal: (newCount: number) => void;
  updateAnalysisTotal: (newCount: number) => void;
}

export const useFinalInspectionStore = create<orderImages>((set) => ({
  total_order_images: 0,
  total_article_images: 0,
  total_analysis: 0,
  updateOrderImagesTotal: (newCount: number) =>
    set((state) => ({ total_order_images: newCount })),

  updateArticleImagesTotal: (newCount: number) =>
    set((state) => ({ total_article_images: newCount })),

  updateAnalysisTotal: (newCount: number) =>
    set((state) => ({ total_analysis: newCount })),
}));
