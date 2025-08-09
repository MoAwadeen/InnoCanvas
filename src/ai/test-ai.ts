import { AIService } from './services/ai-service';

async function testAI() {
  console.log('Testing AI integration...');
  
  try {
    // Test haiku generation
    console.log('\n1. Testing haiku generation...');
    const haiku = await AIService.generateHaiku('technology');
    console.log('Haiku:', haiku);
    
    // Test creative content generation
    console.log('\n2. Testing creative content generation...');
    const content = await AIService.generateCreativeContent('Write a short story about innovation', 'story');
    console.log('Content:', content);
    
    // Test business model canvas
    console.log('\n3. Testing business model canvas...');
    const bmc = await AIService.generateBusinessModelCanvas('AI-powered productivity app');
    console.log('Business Model Canvas:', bmc);
    
    console.log('\n✅ AI integration test completed successfully!');
  } catch (error) {
    console.error('❌ AI integration test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAI();
}

export { testAI }; 