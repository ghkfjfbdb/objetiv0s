
/**
 * Utility to check if an audio file exists
 * @param url URL of the audio file
 * @returns Promise that resolves to true if file exists, false otherwise
 */
export const checkAudioFileExists = async (url: string): Promise<boolean> => {
  try {
    console.log(`Checking if audio file exists at: ${url}`);
    const response = await fetch(url, { method: 'HEAD' });
    const exists = response.ok;
    console.log(`Audio file exists at ${url}: ${exists}, status: ${response.status}`);
    return exists;
  } catch (error) {
    console.error('Error checking audio file:', error);
    return false;
  }
};

/**
 * Utility to suggest possible audio file paths
 * @param baseName The base filename without extension
 * @returns Array of possible paths to try
 */
export const suggestAudioPaths = (baseName: string): string[] => {
  // Remove leading slash if present
  const cleanName = baseName.startsWith('/') ? baseName.substring(1) : baseName;
  
  return [
    `/${cleanName}`,
    `/audio/${cleanName}`,
    `/assets/${cleanName}`,
    `/assets/audio/${cleanName}`,
    `/sounds/${cleanName}`,
    `https://assets.lovable.app/sounds/${cleanName}`,
  ];
};
