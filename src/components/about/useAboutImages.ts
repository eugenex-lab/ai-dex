
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AboutImage } from "./types";

// Fetch all about page images
const fetchAboutImages = async () => {
  try {
    const { data, error } = await supabase
      .from('about_images')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching images:', error);
      throw error;
    }

    return data as AboutImage[];
  } catch (error) {
    console.error('Failed to fetch about images:', error);
    return []; // Return empty array instead of throwing to prevent page crash
  }
};

export const useAboutImages = () => {
  return useQuery({
    queryKey: ['about-images'],
    queryFn: fetchAboutImages,
    refetchOnMount: true,
    staleTime: 0,
    retry: 2,
  });
};

export const getImageForSection = (images: AboutImage[] | undefined, section: string) => {
  try {
    const image = images?.find(img => img.section === section);
    if (!image) return null;
    
    const { data } = supabase.storage.from('about-images').getPublicUrl(image.storage_path);
    return { url: data.publicUrl, alt: image.alt_text };
  } catch (error) {
    console.error(`Error getting image for section ${section}:`, error);
    return null;
  }
};
