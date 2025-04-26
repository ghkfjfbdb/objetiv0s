
/**
 * Utility to check if an audio file exists
 * @param url URL of the audio file
 * @returns Promise that resolves to true if file exists, false otherwise
 */
export const checkAudioFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking audio file:', error);
    return false;
  }
};
