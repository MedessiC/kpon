-- ============================================
-- FIX RLS POLICIES FOR SIGNUP FLOW
-- ============================================

-- 1. Enable new users to create their profile
DROP POLICY IF EXISTS "Users can insert themselves" ON users;

CREATE POLICY "Users can insert themselves"
ON users FOR INSERT
WITH CHECK (true);

-- 2. Keep existing read/update/delete policies
DROP POLICY IF EXISTS "Users can read public profiles" ON users;

CREATE POLICY "Users can read public profiles"
ON users FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON users;

CREATE POLICY "Users can delete own profile"
ON users FOR DELETE
USING (auth.uid() = id);

-- 3. Projects table policies
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;

CREATE POLICY "Projects are viewable by everyone"
ON projects FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create projects" ON projects;

CREATE POLICY "Users can create projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = designer_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;

CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
USING (auth.uid() = designer_id)
WITH CHECK (auth.uid() = designer_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE
USING (auth.uid() = designer_id);

-- 4. Reviews table policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;

CREATE POLICY "Reviews are viewable by everyone"
ON reviews FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;

CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

-- 5. Cart items policies
DROP POLICY IF EXISTS "Cart items are viewable by owner" ON cart_items;

CREATE POLICY "Cart items are viewable by owner"
ON cart_items FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;

CREATE POLICY "Users can manage own cart"
ON cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;

CREATE POLICY "Users can update own cart"
ON cart_items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;

CREATE POLICY "Users can delete own cart items"
ON cart_items FOR DELETE
USING (auth.uid() = user_id);

-- 6. Favorites policies
DROP POLICY IF EXISTS "Favorites are viewable by owner" ON favorites;

CREATE POLICY "Favorites are viewable by owner"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;

CREATE POLICY "Users can manage own favorites"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

CREATE POLICY "Users can delete own favorites"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- 7. Payments policies
DROP POLICY IF EXISTS "Payments are viewable by participants" ON payments;

CREATE POLICY "Payments are viewable by participants"
ON payments FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers can create payments" ON payments;

CREATE POLICY "Buyers can create payments"
ON payments FOR INSERT
WITH CHECK (auth.uid() = buyer_id);
