import { supabase } from './supabase';

export interface PlanLimits {
  plan: string;
  max_canvases: number;
  pdf_download: boolean;
  color_customization: boolean;
  ai_consultant: boolean;
  templates_access: boolean;
  remove_watermark: boolean;
  priority_support: boolean;
  api_access: boolean;
  team_collaboration: boolean;
}

export class PlanService {
  static async checkPlanLimit(userId: string, action: string): Promise<boolean> {
    try {
      // Get user's plan and limits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan, plan_expiry')
        .eq('id', userId)
        .single();
      
      if (profileError || !profile) {
        console.error("Error fetching user profile:", profileError);
        return false;
      }
      
      // Check if plan is expired
      if (profile.plan_expiry && new Date(profile.plan_expiry) < new Date() && profile.plan !== 'free') {
        // Plan is expired, should be downgraded to free
        return false;
      }
      
      // Get plan limits
      const { data: planLimits, error: planError } = await supabase
        .from('plan_limits')
        .select('*')
        .eq('plan', profile.plan)
        .single();
      
      if (planError || !planLimits) {
        console.error("Error fetching plan limits:", planError);
        return false;
      }
      
      // Handle different actions
      switch (action) {
        case 'create_canvas':
          if (planLimits.max_canvases === -1) return true; // Unlimited
          const { data: canvases, error: canvasError } = await supabase
            .from('canvases')
            .select('id')
            .eq('user_id', userId);
          
          if (canvasError) {
            console.error("Error counting canvases:", canvasError);
            return false;
          }
          
          return (canvases?.length || 0) < planLimits.max_canvases;
        
        case 'pdf_download':
          return planLimits.pdf_download;
        
        case 'color_customization':
          return planLimits.color_customization;
        
        case 'ai_consultant':
          return planLimits.ai_consultant;
        
        case 'templates_access':
          return planLimits.templates_access;
        
        case 'remove_watermark':
          return planLimits.remove_watermark;
        
        case 'priority_support':
          return planLimits.priority_support;
        
        case 'api_access':
          return planLimits.api_access;
        
        case 'team_collaboration':
          return planLimits.team_collaboration;
        
        default:
          return false;
      }
    } catch (error) {
      console.error("Error checking plan limits:", error);
      return false;
    }
  }

  static async getPlanLimits(plan: string): Promise<PlanLimits | null> {
    try {
      const { data, error } = await supabase
        .from('plan_limits')
        .select('*')
        .eq('plan', plan)
        .single();
      
      if (error) {
        console.error("Error fetching plan limits:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching plan limits:", error);
      return null;
    }
  }

  static async upgradePlan(userId: string, plan: string, subscriptionId?: string, expiryDate?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          plan,
          subscription_id: subscriptionId,
          plan_expiry: expiryDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Error upgrading plan:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error upgrading plan:", error);
      return false;
    }
  }

  static async downgradeToFree(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          plan: 'free',
          subscription_id: null,
          plan_expiry: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Error downgrading plan:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error downgrading plan:", error);
      return false;
    }
  }
}
