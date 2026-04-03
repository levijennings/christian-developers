-- Christian Developers Billing Schema
-- Tables for managing subscriptions, billing events, and application limits

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  stripe_product_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  plan_tier TEXT NOT NULL CHECK (plan_tier IN ('community', 'pro', 'employer')),
  user_type TEXT NOT NULL CHECK (user_type IN ('job_seeker', 'employer')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Application limits table (monthly tracking)
CREATE TABLE IF NOT EXISTS application_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL CHECK (plan_tier IN ('community', 'pro', 'employer')),
  applications_used INTEGER DEFAULT 0,
  month_started DATE NOT NULL,
  month_ended DATE NOT NULL,
  last_reset TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_limits UNIQUE (user_id),
  CONSTRAINT check_month_dates CHECK (month_started < month_ended)
);

-- Usage resets tracking table (for monthly quota resets)
CREATE TABLE IF NOT EXISTS usage_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reset_date DATE NOT NULL,
  applications_allocated INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_monthly_reset UNIQUE (user_id, reset_date)
);

-- Billing events audit table
CREATE TABLE IF NOT EXISTS billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  data JSONB NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table (cached from Stripe)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  stripe_subscription_id TEXT,
  amount BIGINT NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  attempt_count INTEGER DEFAULT 0,
  next_attempt_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_tier ON subscriptions(plan_tier);
CREATE INDEX IF NOT EXISTS idx_application_limits_user_id ON application_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_application_limits_month ON application_limits(month_started, month_ended);
CREATE INDEX IF NOT EXISTS idx_usage_resets_user_id ON usage_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_resets_reset_date ON usage_resets(reset_date);
CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_stripe_event_id ON billing_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_subscription_id ON invoices(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Row Level Security Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Users can only view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only view their own application limits
CREATE POLICY "Users can view their own application limits"
  ON application_limits FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only view their own usage resets
CREATE POLICY "Users can view their own usage resets"
  ON usage_resets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only view their own billing events
CREATE POLICY "Users can view their own billing events"
  ON billing_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only view their own invoices
CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert/update billing data
CREATE POLICY "Service role can manage subscription data"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage application limits"
  ON application_limits FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage usage resets"
  ON usage_resets FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage billing events"
  ON billing_events FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage invoices"
  ON invoices FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
