// Central AI Provider Manager
import { 
  getProvider, 
  getAvailableProviders, 
  getModelsForProvider, 
  providerSupportsRefinement,
  ThumbnailGenerationOptions,
  ThumbnailResult,
  AIProvider,
  AIModel 
} from './providers';

export { 
  getAvailableProviders, 
  getModelsForProvider, 
  providerSupportsRefinement,
  type AIProvider,
  type AIModel,
  type ThumbnailGenerationOptions,
  type ThumbnailResult 
};

/**
 * Generate a thumbnail using the specified AI provider
 */
export async function generateThumbnail(
  options: ThumbnailGenerationOptions
): Promise<ThumbnailResult> {
  const { provider = 'huggingface' } = options;
  
  const selectedProvider = getProvider(provider);
  if (!selectedProvider) {
    throw new Error(`Provider ${provider} not found`);
  }

  console.log(`🎯 Using provider: ${selectedProvider.name}`);
  
  try {
    return await selectedProvider.generateThumbnail(options);
  } catch (error) {
    console.error(`❌ Error with provider ${selectedProvider.name}:`, error);
    throw error;
  }
}

/**
 * Test connection to a specific AI provider
 */
export async function testConnection(provider: string): Promise<boolean> {
  const selectedProvider = getProvider(provider);
  if (!selectedProvider) {
    throw new Error(`Provider ${provider} not found`);
  }

  console.log(`🔍 Testing connection to ${selectedProvider.name}...`);
  
  try {
    return await selectedProvider.testConnection();
  } catch (error) {
    console.error(`❌ Connection test failed for ${selectedProvider.name}:`, error);
    return false;
  }
}

/**
 * Test all available providers and return their status
 */
export async function testAllProviders(): Promise<Record<string, boolean>> {
  const providers = getAvailableProviders();
  const results: Record<string, boolean> = {};
  
  console.log('🧪 Testing all AI providers...');
  
  for (const provider of providers) {
    try {
      results[provider.id] = await testConnection(provider.id);
    } catch (error) {
      console.error(`❌ Test failed for ${provider.name}:`, error);
      results[provider.id] = false;
    }
  }
  
  return results;
}

/**
 * Get the best available provider based on API key availability
 */
export async function getBestAvailableProvider(): Promise<string> {
  const providers = getAvailableProviders();
  
  // Test providers in order of preference
  const preferenceOrder = ['stability', 'fal', 'huggingface'];
  
  for (const providerId of preferenceOrder) {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      const isAvailable = await testConnection(providerId);
      if (isAvailable) {
        console.log(`✅ Best available provider: ${provider.name}`);
        return providerId;
      }
    }
  }
  
  // Fallback to first provider
  console.log('⚠️ No providers available, falling back to HuggingFace');
  return 'huggingface';
}

/**
 * Get provider availability status
 */
export async function getProviderStatus(): Promise<Record<string, {
  available: boolean;
  name: string;
  description: string;
  pricing: string;
  models: AIModel[];
}>> {
  const providers = getAvailableProviders();
  const status: Record<string, {
    available: boolean;
    name: string;
    description: string;
    pricing: string;
    models: AIModel[];
  }> = {};
  
  for (const provider of providers) {
    const isAvailable = await testConnection(provider.id);
    status[provider.id] = {
      available: isAvailable,
      name: provider.name,
      description: provider.description,
      pricing: provider.pricing,
      models: provider.models,
    };
  }
  
  return status;
} 