
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database';
import { useAuth } from './useAuth';

type Case = Database['public']['Tables']['cases']['Row'] & {
  profiles: {
    name: string;
  };
};

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCases = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          profiles:assigned_rep_id (name)
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchCases();

    // Set up real-time listener with unique channel name
    const channelName = `cases-changes-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cases'
        },
        () => {
          console.log('Cases updated, refetching...');
          fetchCases();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up cases channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-subscriptions

  const updateCase = async (caseId: string, updates: Partial<Database['public']['Tables']['cases']['Update']>) => {
    try {
      const { error } = await supabase
        .from('cases')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;
      await fetchCases();
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  };

  const addTrayScans = async (caseId: string, scannedSerial: string, result: 'matched' | 'mismatched') => {
    try {
      const { error } = await supabase
        .from('tray_scans')
        .insert({
          case_id: caseId,
          scanned_by: user?.id!,
          scanned_serial: scannedSerial,
          result: result
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding tray scan:', error);
      throw error;
    }
  };

  return {
    cases,
    loading,
    updateCase,
    addTrayScans,
    refetch: fetchCases
  };
};
