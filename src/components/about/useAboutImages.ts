
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AboutImage } from "./types";

// Fetch all about page images
const fetchAboutImages = async () => {
  const { data, error } = await supabase
    .from('about_images')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching images:', error);
    throw error;
  }

  return data as AboutImage[];
};

export const useAboutImages = () => {
  return useQuery({
    queryKey: ['about-images'],
    queryFn: fetchAboutImages,
    refetchOnMount: true,
    staleTime: 0
  });
};

export const getImageForSection = (images: AboutImage[] | undefined, section: string) => {
  const image = images?.find(img => img.section === section);
  if (!image) return null;
  const { data } = supabase.storage.from('about-images').getPublicUrl(image.storage_path);
  return { url: data.publicUrl, alt: image.alt_text };
};
