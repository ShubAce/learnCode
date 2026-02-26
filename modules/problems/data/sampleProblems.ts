// Sample Problem Data for Create Problem Form
// Each problem type has at least 2 sample problems

// ============================================
// DYNAMIC PROGRAMMING
// ============================================

export const dpProblems = [
	{
		id: "dp-1",
		title: "Climbing Stairs",
		description:
			"You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
		difficulty: "EASY" as const,
		tags: ["Dynamic Programming", "Math", "Memoization"],
		constraints: "1 <= n <= 45",
		hints: "Think about how you can reach step n. You can only get to step n from step n-1 or step n-2.",
		editorial:
			"This is a classic Fibonacci problem. The number of ways to reach step n is the sum of ways to reach step n-1 and n-2. Use dynamic programming to avoid recalculating subproblems.",
		testCases: [
			{ input: "2", output: "2" },
			{ input: "3", output: "3" },
			{ input: "4", output: "5" },
		],
		examples: {
			JAVASCRIPT: {
				input: "n = 2",
				output: "2",
				explanation: "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
			},
			PYTHON: {
				input: "n = 3",
				output: "3",
				explanation: "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
			},
			JAVA: {
				input: "n = 4",
				output: "5",
				explanation:
					"There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
			},
			CPP: {
				input: "n = 2",
				output: "2",
				explanation: "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
    // Write your code here
}`,
			PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your code here
        pass`,
			JAVA: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
    }
}`,
			CPP: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function climbStairs(n) {
    if (n <= 2) return n;
    let dp = [0, 1, 2];
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
			PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        dp = [0, 1, 2]
        for i in range(3, n + 1):
            dp.append(dp[i - 1] + dp[i - 2])
        return dp[n]`,
			JAVA: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}`,
			CPP: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        vector<int> dp(n + 1);
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
};`,
		},
	},
	{
		id: "dp-2",
		title: "House Robber",
		description:
			"You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses are arranged in a circle, meaning the first house is the neighbor of the last one. Adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
		difficulty: "MEDIUM" as const,
		tags: ["Dynamic Programming", "Array"],
		constraints: "1 <= nums.length <= 100. 0 <= nums[i] <= 1000",
		hints: "You cannot rob two adjacent houses. Use DP to track maximum at each position.",
		editorial:
			"For each house, you have two choices: rob it (and skip the previous) or don't rob it (take the previous max). Use dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
		testCases: [
			{ input: "1 2 3 1", output: "4" },
			{ input: "2 7 9 3 1", output: "12" },
		],
		examples: {
			JAVASCRIPT: {
				input: "nums = [1,2,3,1]",
				output: "4",
				explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4.",
			},
			PYTHON: {
				input: "nums = [2,7,9,3,1]",
				output: "12",
				explanation: "Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total = 2 + 9 + 1 = 12.",
			},
			JAVA: {
				input: "nums = [1,2,3,1]",
				output: "4",
				explanation: "Rob house 1 and house 3.",
			},
			CPP: {
				input: "nums = [2,7,9,3,1]",
				output: "12",
				explanation: "Rob houses at index 0, 2, and 4.",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `function rob(nums) {
    // Your code here
}`,
			PYTHON: `class Solution:
    def rob(self, nums):
        # Your code here
        pass`,
			JAVA: `class Solution {
    public int rob(int[] nums) {
        // Your code here
    }
}`,
			CPP: `class Solution {
public:
    int rob(vector<int>& nums) {
        // Your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function rob(nums) {
    if (nums.length === 1) return nums[0];
    let prev = 0, curr = 0;
    for (let num of nums) {
        let temp = Math.max(curr, prev + num);
        prev = curr;
        curr = temp;
    }
    return curr;
}`,
			PYTHON: `class Solution:
    def rob(self, nums):
        if len(nums) == 1:
            return nums[0]
        prev, curr = 0, 0
        for num in nums:
            temp = max(curr, prev + num)
            prev = curr
            curr = temp
        return curr`,
			JAVA: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int prev = 0, curr = 0;
        for (int num : nums) {
            int temp = Math.max(curr, prev + num);
            prev = curr;
            curr = temp;
        }
        return curr;
    }
}`,
			CPP: `class Solution {
public:
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        int prev = 0, curr = 0;
        for (int num : nums) {
            int temp = max(curr, prev + num);
            prev = curr;
            curr = temp;
        }
        return curr;
    }
};`,
		},
	},
];

// ============================================
// STRING MANIPULATION
// ============================================

export const stringProblems = [
	{
		id: "string-1",
		title: "Valid Palindrome",
		description:
			"A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
		difficulty: "EASY" as const,
		tags: ["String", "Two Pointers"],
		constraints: "1 <= s.length <= 2 * 10^5. s consists only of printable ASCII characters.",
		hints: "Use two pointers from both ends. Skip non-alphanumeric characters.",
		editorial: "Clean the string by removing non-alphanumeric characters and converting to lowercase. Then check if it equals its reverse.",
		testCases: [
			{ input: "A man, a plan, a canal: Panama", output: "true" },
			{ input: "race a car", output: "false" },
		],
		examples: {
			JAVASCRIPT: {
				input: 's = "A man, a plan, a canal: Panama"',
				output: "true",
				explanation: 'After cleaning: "amanaplanacanalpanama" is a palindrome.',
			},
			PYTHON: {
				input: 's = "race a car"',
				output: "false",
				explanation: 'After cleaning: "raceacar" is not a palindrome.',
			},
			JAVA: {
				input: 's = "A man, a plan, a canal: Panama"',
				output: "true",
				explanation: "Reads same forwards and backwards after cleaning.",
			},
			CPP: {
				input: 's = "race a car"',
				output: "false",
				explanation: "Not a palindrome.",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `function isPalindrome(s) {
    // Your code here
}`,
			PYTHON: `class Solution:
    def isPalindrome(self, s):
        # Your code here
        pass`,
			JAVA: `class Solution {
    public boolean isPalindrome(String s) {
        // Your code here
    }
}`,
			CPP: `class Solution {
public:
    bool isPalindrome(string s) {
        // Your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`,
			PYTHON: `class Solution:
    def isPalindrome(self, s):
        cleaned = ''.join(c.lower() for c in s if c.isalnum())
        return cleaned == cleaned[::-1]`,
			JAVA: `class Solution {
    public boolean isPalindrome(String s) {
        String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        return cleaned.equals(new StringBuilder(cleaned).reverse().toString());
    }
}`,
			CPP: `class Solution {
public:
    bool isPalindrome(string s) {
        string cleaned;
        for (char c : s) {
            if (isalnum(c)) cleaned += tolower(c);
        }
        string rev = cleaned;
        reverse(rev.begin(), rev.end());
        return cleaned == rev;
    }
};`,
		},
	},
	{
		id: "string-2",
		title: "Longest Common Prefix",
		description:
			"Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
		difficulty: "EASY" as const,
		tags: ["String", "Array"],
		constraints: "1 <= strs.length <= 200. 0 <= strs[i].length <= 200. strs[i] consists of only lowercase English letters.",
		hints: "Compare characters at each position across all strings.",
		editorial: "Sort the array and compare only the first and last strings, as the common prefix must be present in both.",
		testCases: [
			{ input: "flower flow flight", output: "fl" },
			{ input: "dog racecar car", output: "" },
		],
		examples: {
			JAVASCRIPT: {
				input: 'strs = ["flower","flow","flight"]',
				output: '"fl"',
				explanation: "The longest common prefix is 'fl'.",
			},
			PYTHON: {
				input: 'strs = ["dog","racecar","car"]',
				output: '""',
				explanation: "There is no common prefix among the input strings.",
			},
			JAVA: {
				input: 'strs = ["flower","flow","flight"]',
				output: '"fl"',
				explanation: "Common prefix is 'fl'.",
			},
			CPP: {
				input: 'strs = ["dog","racecar","car"]',
				output: '""',
				explanation: "No common prefix.",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `function longestCommonPrefix(strs) {
    // Your code here
}`,
			PYTHON: `class Solution:
    def longestCommonPrefix(self, strs):
        # Your code here
        pass`,
			JAVA: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        // Your code here
    }
}`,
			CPP: `class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        // Your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function longestCommonPrefix(strs) {
    if (!strs.length) return "";
    for (let i = 0; i < strs[0].length; i++) {
        for (let str of strs) {
            if (i >= str.length || str[i] !== strs[0][i]) {
                return strs[0].slice(0, i);
            }
        }
    }
    return strs[0];
}`,
			PYTHON: `class Solution:
    def longestCommonPrefix(self, strs):
        if not strs:
            return ""
        for i in range(len(strs[0])):
            for s in strs:
                if i >= len(s) or s[i] != strs[0][i]:
                    return strs[0][:i]
        return strs[0]`,
			JAVA: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs.length == 0) return "";
        for (int i = 0; i < strs[0].length(); i++) {
            for (String s : strs) {
                if (i >= s.length() || s.charAt(i) != strs[0].charAt(i)) {
                    return strs[0].substring(0, i);
                }
            }
        }
        return strs[0];
    }
}`,
			CPP: `class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        for (int i = 0; i < strs[0].size(); i++) {
            for (const string& s : strs) {
                if (i >= s.size() || s[i] != strs[0][i]) {
                    return strs[0].substr(0, i);
                }
            }
        }
        return strs[0];
    }
};`,
		},
	},
];

// ============================================
// ARRAY / HASH TABLE
// ============================================

export const arrayProblems = [
	{
		id: "array-1",
		title: "Two Sum",
		description:
			"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
		difficulty: "EASY" as const,
		tags: ["Array", "Hash Table"],
		constraints: "2 <= nums.length <= 10^4. -10^9 <= nums[i] <= 10^9. -10^9 <= target <= 10^9. Only one valid answer exists.",
		hints: "Use a hash map to store numbers you've seen and their indices.",
		editorial:
			"Iterate through array. For each number, check if (target - number) exists in hash map. If yes, return indices. Otherwise, add current number to map.",
		testCases: [
			{ input: "2 7 11 15\n9", output: "[0,1]" },
			{ input: "3 2 4\n6", output: "[1,2]" },
		],
		examples: {
			JAVASCRIPT: {
				input: "nums = [2,7,11,15], target = 9",
				output: "[0,1]",
				explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
			},
			PYTHON: {
				input: "nums = [3,2,4], target = 6",
				output: "[1,2]",
				explanation: "nums[1] + nums[2] = 2 + 4 = 6.",
			},
			JAVA: {
				input: "nums = [3,3], target = 6",
				output: "[0,1]",
				explanation: "Both elements sum to target.",
			},
			CPP: {
				input: "nums = [2,7,11,15], target = 9",
				output: "[0,1]",
				explanation: "Sum of indices 0 and 1 equals target.",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `function twoSum(nums, target) {
    // Your code here
}`,
			PYTHON: `class Solution:
    def twoSum(self, nums, target):
        # Your code here
        pass`,
			JAVA: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
			CPP: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
}`,
			PYTHON: `class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i`,
			JAVA: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] {map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return null;
    }
}`,
			CPP: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
		},
	},
	{
		id: "array-2",
		title: "Contains Duplicate",
		description:
			"Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
		difficulty: "EASY" as const,
		tags: ["Array", "Hash Table"],
		constraints: "1 <= nums.length <= 10^5. -10^9 <= nums[i] <= 10^9",
		hints: "Use a hash set to track seen numbers.",
		editorial: "Add each number to a set. If you encounter a number already in the set, return true. If you finish the loop, return false.",
		testCases: [
			{ input: "1 2 3 1", output: "true" },
			{ input: "1 2 3 4", output: "false" },
		],
		examples: {
			JAVASCRIPT: {
				input: "nums = [1,2,3,1]",
				output: "true",
				explanation: "The value 1 appears twice.",
			},
			PYTHON: {
				input: "nums = [1,2,3,4]",
				output: "false",
				explanation: "All elements are distinct.",
			},
			JAVA: {
				input: "nums = [1,2,3,1]",
				output: "true",
				explanation: "Duplicate found.",
			},
			CPP: {
				input: "nums = [1,2,3,4]",
				output: "false",
				explanation: "No duplicates.",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `function containsDuplicate(nums) {
    // Your code here
}`,
			PYTHON: `class Solution:
    def containsDuplicate(self, nums):
        # Your code here
        pass`,
			JAVA: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Your code here
    }
}`,
			CPP: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function containsDuplicate(nums) {
    const set = new Set(nums);
    return set.size !== nums.length;
}`,
			PYTHON: `class Solution:
    def containsDuplicate(self, nums):
        return len(set(nums)) != len(nums)`,
			JAVA: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            if (set.contains(num)) return true;
            set.add(num);
        }
        return false;
    }
}`,
			CPP: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> set;
        for (int num : nums) {
            if (set.count(num)) return true;
            set.insert(num);
        }
        return false;
    }
};`,
		},
	},
];

// Continue with remaining problem types...
// Due to length, I'll create the structure for all 15 types with 2 problems each

export const graphProblems = [
	{
		id: "graph-1",
		title: "Number of Islands",
		description:
			"Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
		difficulty: "MEDIUM" as const,
		tags: ["Graph", "BFS", "DFS", "Matrix"],
		constraints: "m == grid.length. n == grid[i].length. 1 <= m, n <= 300. grid[i][j] is '0' or '1'.",
		hints: "Use DFS or BFS to explore each island. Mark visited cells.",
		editorial: "Iterate through the grid. When you find a '1', increment island count and run DFS/BFS to mark all connected '1's as visited.",
		testCases: [
			{ input: "1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", output: "1" },
			{ input: "1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3" },
		],
		examples: {
			JAVASCRIPT: {
				input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
				output: "2",
				explanation: "There are 2 islands.",
			},
			PYTHON: {
				input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
				output: "2",
				explanation: "Two separate islands.",
			},
			JAVA: {
				input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
				output: "2",
				explanation: "Count is 2.",
			},
			CPP: {
				input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
				output: "2",
				explanation: "Two islands found.",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `function numIslands(grid) {
    // Your code here
}`,
			PYTHON: `class Solution:
    def numIslands(self, grid):
        # Your code here
        pass`,
			JAVA: `class Solution {
    public int numIslands(char[][] grid) {
        // Your code here
    }
}`,
			CPP: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function numIslands(grid) {
    let count = 0;
    function dfs(i, j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') return;
        grid[i][j] = '0';
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    }
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);
            }
        }
    }
    return count;
}`,
			PYTHON: `class Solution:
    def numIslands(self, grid):
        if not grid:
            return 0
        count = 0
        def dfs(i, j):
            if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] == '0':
                return
            grid[i][j] = '0'
            dfs(i + 1, j)
            dfs(i - 1, j)
            dfs(i, j + 1)
            dfs(i, j - 1)
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j] == '1':
                    count += 1
                    dfs(i, j)
        return count`,
			JAVA: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] == '0') return;
        grid[i][j] = '0';
        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }
}`,
			CPP: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid[0].size(); j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }
private:
    void dfs(vector<vector<char>>& grid, int i, int j) {
        if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size() || grid[i][j] == '0') return;
        grid[i][j] = '0';
        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }
};`,
		},
	},
	{
		id: "graph-2",
		title: "Clone Graph",
		description:
			"Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of its neighbors.",
		difficulty: "MEDIUM" as const,
		tags: ["Graph", "DFS", "BFS", "Hash Table"],
		constraints: "The number of nodes is in range [0, 100]. 1 <= Node.val <= 100. Node.val is unique for each node.",
		hints: "Use a hash map to track cloned nodes. Use DFS or BFS to traverse.",
		editorial: "Create a hash map from original to cloned nodes. For each node, clone it and recursively clone its neighbors.",
		testCases: [
			{ input: "[[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" },
			{ input: "[[]]", output: "[[]]" },
		],
		examples: {
			JAVASCRIPT: {
				input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
				output: "[[2,4],[1,3],[2,4],[1,3]]",
				explanation: "Graph is cloned successfully.",
			},
			PYTHON: {
				input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
				output: "[[2,4],[1,3],[2,4],[1,3]]",
				explanation: "Deep copy created.",
			},
			JAVA: {
				input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
				output: "[[2,4],[1,3],[2,4],[1,3]]",
				explanation: "Cloned graph.",
			},
			CPP: {
				input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
				output: "[[2,4],[1,3],[2,4],[1,3]]",
				explanation: "Graph cloned.",
			},
		},
		codeSnippets: {
			JAVASCRIPT: `function cloneGraph(node) {
    // Your code here
}`,
			PYTHON: `class Solution:
    def cloneGraph(self, node):
        # Your code here
        pass`,
			JAVA: `class Solution {
    public Node cloneGraph(Node node) {
        // Your code here
    }
}`,
			CPP: `class Solution {
public:
    Node* cloneGraph(Node* node) {
        // Your code here
    }
};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function cloneGraph(node) {
    if (!node) return null;
    const map = new Map();
    function dfs(n) {
        if (map.has(n)) return map.get(n);
        const clone = {val: n.val, neighbors: []};
        map.set(n, clone);
        for (let neighbor of n.neighbors) {
            clone.neighbors.push(dfs(neighbor));
        }
        return clone;
    }
    return dfs(node);
}`,
			PYTHON: `class Solution:
    def cloneGraph(self, node):
        if not node:
            return None
        clones = {}
        def dfs(n):
            if n in clones:
                return clones[n]
            clone = Node(n.val)
            clones[n] = clone
            for neighbor in n.neighbors:
                clone.neighbors.append(dfs(neighbor))
            return clone
        return dfs(node)`,
			JAVA: `class Solution {
    private Map<Node, Node> map = new HashMap<>();
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (map.containsKey(node)) return map.get(node);
        Node clone = new Node(node.val);
        map.put(node, clone);
        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }
        return clone;
    }
}`,
			CPP: `class Solution {
private:
    unordered_map<Node*, Node*> map;
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        if (map.count(node)) return map[node];
        Node* clone = new Node(node->val);
        map[node] = clone;
        for (Node* neighbor : node->neighbors) {
            clone->neighbors.push_back(cloneGraph(neighbor));
        }
        return clone;
    }
};`,
		},
	},
];

// ============================================
// TREE
// ============================================

export const treeProblems = [
	{
		id: "tree-1",
		title: "Maximum Depth of Binary Tree",
		description:
			"Given the root of a binary tree, return its maximum depth. Maximum depth is the number of nodes along the longest path from the root down to the farthest leaf.",
		difficulty: "EASY" as const,
		tags: ["Tree", "DFS", "Binary Tree"],
		constraints: "The number of nodes is in range [0, 10^4]. -100 <= Node.val <= 100",
		hints: "Use recursion. The depth is 1 + max(leftDepth, rightDepth).",
		editorial: "Recursively calculate depth of left and right subtrees, return 1 + maximum of the two.",
		testCases: [
			{ input: "3 9 20 -1 -1 15 7", output: "3" },
			{ input: "1 -1 2", output: "2" },
		],
		examples: {
			JAVASCRIPT: { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "The maximum depth is 3." },
			PYTHON: { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "Path: 3 -> 20 -> 7" },
			JAVA: { input: "root = [1,null,2]", output: "2", explanation: "Two nodes in path." },
			CPP: { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "Depth is 3." },
		},
		codeSnippets: {
			JAVASCRIPT: `function maxDepth(root) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def maxDepth(self, root):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`,
			PYTHON: `class Solution:\n    def maxDepth(self, root):\n        if not root:\n            return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
			JAVA: `class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (!root) return 0;\n        return 1 + max(maxDepth(root->left), maxDepth(root->right));\n    }\n};`,
		},
	},
	{
		id: "tree-2",
		title: "Invert Binary Tree",
		description: "Given the root of a binary tree, invert the tree, and return its root.",
		difficulty: "EASY" as const,
		tags: ["Tree", "DFS", "BFS", "Binary Tree"],
		constraints: "The number of nodes is in range [0, 100]. -100 <= Node.val <= 100",
		hints: "Swap left and right children of each node recursively.",
		editorial: "For each node, swap its left and right children, then recursively invert both subtrees.",
		testCases: [
			{ input: "4 2 7 1 3 6 9", output: "4 7 2 9 6 3 1" },
			{ input: "2 1 3", output: "2 3 1" },
		],
		examples: {
			JAVASCRIPT: { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "Tree is inverted." },
			PYTHON: { input: "root = [2,1,3]", output: "[2,3,1]", explanation: "Left and right swapped." },
			JAVA: { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "Inverted successfully." },
			CPP: { input: "root = [2,1,3]", output: "[2,3,1]", explanation: "Inverted tree." },
		},
		codeSnippets: {
			JAVASCRIPT: `function invertTree(root) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def invertTree(self, root):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function invertTree(root) {\n    if (!root) return null;\n    [root.left, root.right] = [root.right, root.left];\n    invertTree(root.left);\n    invertTree(root.right);\n    return root;\n}`,
			PYTHON: `class Solution:\n    def invertTree(self, root):\n        if not root:\n            return None\n        root.left, root.right = root.right, root.left\n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        return root`,
			JAVA: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = root.right;\n        root.right = temp;\n        invertTree(root.left);\n        invertTree(root.right);\n        return root;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        swap(root->left, root->right);\n        invertTree(root.left);\n        invertTree(root.right);\n        return root;\n    }\n};`,
		},
	},
];

// ============================================
// LINKED LIST
// ============================================

export const linkedListProblems = [
	{
		id: "ll-1",
		title: "Reverse Linked List",
		description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
		difficulty: "EASY" as const,
		tags: ["Linked List", "Recursion"],
		constraints: "The number of nodes is in range [0, 5000]. -5000 <= Node.val <= 5000",
		hints: "Use iterative approach with prev, curr, next pointers. Or use recursion.",
		editorial: "Iterate through list, reversing pointers. Keep track of previous, current, and next nodes.",
		testCases: [
			{ input: "1 2 3 4 5", output: "5 4 3 2 1" },
			{ input: "1 2", output: "2 1" },
		],
		examples: {
			JAVASCRIPT: { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "List is reversed." },
			PYTHON: { input: "head = [1,2]", output: "[2,1]", explanation: "Two nodes reversed." },
			JAVA: { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "Reversed successfully." },
			CPP: { input: "head = [1,2,3]", output: "[3,2,1]", explanation: "List reversed." },
		},
		codeSnippets: {
			JAVASCRIPT: `function reverseList(head) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def reverseList(self, head):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
			PYTHON: `class Solution:\n    def reverseList(self, head):\n        prev, curr = None, head\n        while curr:\n            next_node = curr.next\n            curr.next = prev\n            prev = curr\n            curr = next_node\n        return prev`,
			JAVA: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode *prev = nullptr, *curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};`,
		},
	},
	{
		id: "ll-2",
		title: "Merge Two Sorted Lists",
		description:
			"Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
		difficulty: "EASY" as const,
		tags: ["Linked List", "Recursion", "Two Pointers"],
		constraints: "The number of nodes in both lists is in range [0, 50]. -100 <= Node.val <= 100. Both lists are sorted in non-decreasing order.",
		hints: "Use a dummy head node. Compare nodes from both lists one by one.",
		editorial: "Create a dummy node. Iterate both lists, appending smaller node each time. Handle remaining nodes.",
		testCases: [
			{ input: "1 2 4, 1 3 4", output: "1 1 2 3 4 4" },
			{ input: "", output: "" },
		],
		examples: {
			JAVASCRIPT: { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Merged sorted lists." },
			PYTHON: { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Both lists merged." },
			JAVA: { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Sorted merge." },
			CPP: { input: "list1 = [], list2 = []", output: "[]", explanation: "Empty lists." },
		},
		codeSnippets: {
			JAVASCRIPT: `function mergeTwoLists(list1, list2) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def mergeTwoLists(self, list1, list2):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function mergeTwoLists(list1, list2) {\n    let dummy = {next: null}, tail = dummy;\n    while (list1 && list2) {\n        if (list1.val < list2.val) {\n            tail.next = list1;\n            list1 = list1.next;\n        } else {\n            tail.next = list2;\n            list2 = list2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = list1 || list2;\n    return dummy.next;\n}`,
			PYTHON: `class Solution:\n    def mergeTwoLists(self, list1, list2):\n        dummy = ListNode()\n        tail = dummy\n        while list1 and list2:\n            if list1.val < list2.val:\n                tail.next = list1\n                list1 = list1.next\n            else:\n                tail.next = list2\n                list2 = list2.next\n            tail = tail.next\n        tail.next = list1 or list2\n        return dummy.next`,
			JAVA: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(), tail = dummy;\n        while (list1 != null && list2 != null) {\n            if (list1.val < list2.val) {\n                tail.next = list1;\n                list1 = list1.next;\n            } else {\n                tail.next = list2;\n                list2 = list2.next;\n            }\n            tail = tail.next;\n        }\n        tail.next = list1 != null ? list1 : list2;\n        return dummy.next;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        ListNode dummy, *tail = &dummy;\n        while (list1 && list2) {\n            if (list1->val < list2->val) {\n                tail->next = list1;\n                list1 = list1->next;\n            } else {\n                tail->next = list2;\n                list2 = list2->next;\n            }\n            tail = tail->next;\n        }\n        tail->next = list1 ? list1 : list2;\n        return dummy.next;\n    }\n};`,
		},
	},
];
export const binarySearchProblems = [
	{
		id: "bs-1",
		title: "Binary Search",
		description:
			"Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.",
		difficulty: "EASY" as const,
		tags: ["Binary Search", "Array"],
		constraints: "1 <= nums.length <= 10^4. -10^4 < nums[i], target < 10^4. All integers in nums are unique. nums is sorted in ascending order.",
		hints: "Use two pointers, left and right. Calculate mid and compare with target.",
		editorial: "Classic binary search. Compare middle element with target. Adjust search range based on comparison.",
		testCases: [
			{ input: "[-1,0,3,5,9,12], 9", output: "4" },
			{ input: "[-1,0,3,5,9,12], 2", output: "-1" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists at index 4." },
			PYTHON: { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist." },
			JAVA: { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "Found at index 4." },
			CPP: { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "Index 4." },
		},
		codeSnippets: {
			JAVASCRIPT: `function search(nums, target) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def search(self, nums, target):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        let mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`,
			PYTHON: `class Solution:\n    def search(self, nums, target):\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[mid] < target:\n                left = mid + 1\n            else:\n                right = mid - 1\n        return -1`,
			JAVA: `class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n};`,
		},
	},
	{
		id: "bs-2",
		title: "Search Insert Position",
		description:
			"Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
		difficulty: "EASY" as const,
		tags: ["Binary Search", "Array"],
		constraints:
			"1 <= nums.length <= 10^4. -10^4 <= nums[i] <= 10^4. nums contains distinct values sorted in ascending order. -10^4 <= target <= 10^4",
		hints: "Use binary search. When not found, left pointer gives the insert position.",
		editorial: "Binary search to find target or insertion point. Return left pointer when loop ends.",
		testCases: [
			{ input: "[1,3,5,6], 5", output: "2" },
			{ input: "[1,3,5,6], 2", output: "1" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [1,3,5,6], target = 5", output: "2", explanation: "5 is at index 2." },
			PYTHON: { input: "nums = [1,3,5,6], target = 2", output: "1", explanation: "Would insert at index 1." },
			JAVA: { input: "nums = [1,3,5,6], target = 7", output: "4", explanation: "Insert at end." },
			CPP: { input: "nums = [1,3,5,6], target = 0", output: "0", explanation: "Insert at start." },
		},
		codeSnippets: {
			JAVASCRIPT: `function searchInsert(nums, target) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def searchInsert(self, nums, target):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function searchInsert(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        let mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return left;\n}`,
			PYTHON: `class Solution:\n    def searchInsert(self, nums, target):\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[mid] < target:\n                left = mid + 1\n            else:\n                right = mid - 1\n        return left`,
			JAVA: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return left;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return left;\n    }\n};`,
		},
	},
];
export const stackProblems = [
	{
		id: "stack-1",
		title: "Valid Parentheses",
		description:
			"Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
		difficulty: "EASY" as const,
		tags: ["Stack", "String"],
		constraints: "1 <= s.length <= 10^4. s consists of parentheses only '()[]{}'",
		hints: "Use a stack to keep track of opening brackets. Match them with closing brackets.",
		editorial: "Push opening brackets onto stack. For closing brackets, check if they match the top of stack.",
		testCases: [
			{ input: "()", output: "true" },
			{ input: "()[]{}", output: "true" },
			{ input: "(]", output: "false" },
		],
		examples: {
			JAVASCRIPT: { input: "s = '()'", output: "true", explanation: "Valid parentheses." },
			PYTHON: { input: "s = '()[]{}'", output: "true", explanation: "All matched." },
			JAVA: { input: "s = '(]'", output: "false", explanation: "Not matched." },
			CPP: { input: "s = '()'", output: "true", explanation: "Valid." },
		},
		codeSnippets: {
			JAVASCRIPT: `function isValid(s) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def isValid(self, s):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function isValid(s) {\n    const stack = [], map = {'(': ')', '{': '}', '[': ']'};\n    for (let c of s) {\n        if (map[c]) stack.push(map[c]);\n        else if (!stack.length || stack.pop() !== c) return false;\n    }\n    return !stack.length;\n}`,
			PYTHON: `class Solution:\n    def isValid(self, s):\n        stack = []\n        mapping = {'(': ')', '{': '}', '[': ']'}\n        for c in s:\n            if c in mapping:\n                stack.append(mapping[c])\n            elif not stack or stack.pop() != c:\n                return False\n        return not stack`,
			JAVA: `class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
			CPP: `class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else if (st.empty() || st.top() != c) return false;\n            else st.pop();\n        }\n        return st.empty();\n    }\n};`,
		},
	},
	{
		id: "stack-2",
		title: "Min Stack",
		description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
		difficulty: "MEDIUM" as const,
		tags: ["Stack", "Design"],
		constraints:
			"-2^31 <= val <= 2^31 - 1. Methods pop, top and getMin operations will always be called on non-empty stacks. At most 3 * 10^4 calls will be made to push, pop, top, and getMin.",
		hints: "Use two stacks, one for values and one for minimums. Or store pairs of (value, min).",
		editorial: "Maintain a separate stack that tracks the minimum value at each level.",
		testCases: [
			{
				input: "['MinStack','push','push','push','getMin','pop','top','getMin'], [[],[-2],[0],[-3],[],[],[],[]]",
				output: "[null,null,null,null,-3,null,0,-2]",
			},
		],
		examples: {
			JAVASCRIPT: { input: "push(-2), push(0), push(-3), getMin()", output: "-3", explanation: "Min is -3." },
			PYTHON: { input: "pop(), top(), getMin()", output: "0, -2", explanation: "After pop, min is -2." },
			JAVA: { input: "push(-2), push(0), push(-3)", output: "null", explanation: "Operations successful." },
			CPP: { input: "getMin()", output: "-3", explanation: "Current minimum." },
		},
		codeSnippets: {
			JAVASCRIPT: `class MinStack {\n    constructor() {\n        // Your code here\n    }\n    push(val) {}\n    pop() {}\n    top() {}\n    getMin() {}\n}`,
			PYTHON: `class MinStack:\n    def __init__(self):\n        # Your code here\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def top(self):\n        pass\n    def getMin(self):\n        pass`,
			JAVA: `class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() {}\n    public int getMin() {}\n}`,
			CPP: `class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() {}\n    int getMin() {}\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `class MinStack {\n    constructor() {\n        this.stack = [];\n        this.minStack = [];\n    }\n    push(val) {\n        this.stack.push(val);\n        const min = this.minStack.length ? Math.min(val, this.minStack[this.minStack.length-1]) : val;\n        this.minStack.push(min);\n    }\n    pop() {\n        this.stack.pop();\n        this.minStack.pop();\n    }\n    top() {\n        return this.stack[this.stack.length - 1];\n    }\n    getMin() {\n        return this.minStack[this.minStack.length - 1];\n    }\n}`,
			PYTHON: `class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val):\n        self.stack.append(val)\n        min_val = min(val, self.min_stack[-1] if self.min_stack else val)\n        self.min_stack.append(min_val)\n    def pop(self):\n        self.stack.pop()\n        self.min_stack.pop()\n    def top(self):\n        return self.stack[-1]\n    def getMin(self):\n        return self.min_stack[-1]`,
			JAVA: `class MinStack {\n    private Stack<Integer> stack = new Stack<>();\n    private Stack<Integer> minStack = new Stack<>();\n    public void push(int val) {\n        stack.push(val);\n        int min = minStack.isEmpty() ? val : Math.min(val, minStack.peek());\n        minStack.push(min);\n    }\n    public void pop() {\n        stack.pop();\n        minStack.pop();\n    }\n    public int top() {\n        return stack.peek();\n    }\n    public int getMin() {\n        return minStack.peek();\n    }\n}`,
			CPP: `class MinStack {\n    stack<int> st;\n    stack<int> minSt;\npublic:\n    void push(int val) {\n        st.push(val);\n        int minVal = minSt.empty() ? val : min(val, minSt.top());\n        minSt.push(minVal);\n    }\n    void pop() {\n        st.pop();\n        minSt.pop();\n    }\n    int top() {\n        return st.top();\n    }\n    int getMin() {\n        return minSt.top();\n    }\n};`,
		},
	},
];

// ============================================
// BACKTRACKING
// ============================================

export const backtrackingProblems = [
	{
		id: "bt-1",
		title: "Permutations",
		description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
		difficulty: "MEDIUM" as const,
		tags: ["Backtracking", "Array"],
		constraints: "1 <= nums.length <= 6. -10 <= nums[i] <= 10. All integers of nums are unique.",
		hints: "Use backtracking. At each step, try adding each unused number.",
		editorial: "Build permutations recursively. Track which numbers are used. Backtrack when a complete permutation is formed.",
		testCases: [
			{ input: "[1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
			{ input: "[0,1]", output: "[[0,1],[1,0]]" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", explanation: "All permutations." },
			PYTHON: { input: "nums = [0,1]", output: "[[0,1],[1,0]]", explanation: "Two permutations." },
			JAVA: { input: "nums = [1]", output: "[[1]]", explanation: "Single element." },
			CPP: { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],...]", explanation: "All permutations." },
		},
		codeSnippets: {
			JAVASCRIPT: `function permute(nums) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def permute(self, nums):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function permute(nums) {\n    const result = [];\n    function backtrack(path, used) {\n        if (path.length === nums.length) {\n            result.push([...path]);\n            return;\n        }\n        for (let i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            path.push(nums[i]);\n            used[i] = true;\n            backtrack(path, used);\n            path.pop();\n            used[i] = false;\n        }\n    }\n    backtrack([], []);\n    return result;\n}`,
			PYTHON: `class Solution:\n    def permute(self, nums):\n        result = []\n        def backtrack(path, used):\n            if len(path) == len(nums):\n                result.append(path[:])\n                return\n            for i in range(len(nums)):\n                if used[i]:\n                    continue\n                path.append(nums[i])\n                used[i] = True\n                backtrack(path, used)\n                path.pop()\n                used[i] = False\n        backtrack([], [False] * len(nums))\n        return result`,
			JAVA: `class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);\n        return result;\n    }\n    private void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> result) {\n        if (path.size() == nums.length) {\n            result.add(new ArrayList<>(path));\n            return;\n        }\n        for (int i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            path.add(nums[i]);\n            used[i] = true;\n            backtrack(nums, path, used, result);\n            path.remove(path.size() - 1);\n            used[i] = false;\n        }\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        vector<vector<int>> result;\n        vector<int> path;\n        vector<bool> used(nums.size(), false);\n        backtrack(nums, path, used, result);\n        return result;\n    }\nprivate:\n    void backtrack(vector<int>& nums, vector<int>& path, vector<bool>& used, vector<vector<int>>& result) {\n        if (path.size() == nums.size()) {\n            result.push_back(path);\n            return;\n        }\n        for (int i = 0; i < nums.size(); i++) {\n            if (used[i]) continue;\n            path.push_back(nums[i]);\n            used[i] = true;\n            backtrack(nums, path, used, result);\n            path.pop_back();\n            used[i] = false;\n        }\n    }\n};`,
		},
	},
	{
		id: "bt-2",
		title: "Subsets",
		description:
			"Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
		difficulty: "MEDIUM" as const,
		tags: ["Backtracking", "Array", "Bit Manipulation"],
		constraints: "1 <= nums.length <= 10. -10 <= nums[i] <= 10. All numbers of nums are unique.",
		hints: "Use backtracking. At each step, either include or exclude current element.",
		editorial: "Build subsets incrementally. For each element, decide to include it or not.",
		testCases: [
			{ input: "[1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
			{ input: "[0]", output: "[[],[0]]" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", explanation: "Power set." },
			PYTHON: { input: "nums = [0]", output: "[[],[0]]", explanation: "Two subsets." },
			JAVA: { input: "nums = [1,2,3]", output: "[[],[1],[2],...]", explanation: "All subsets." },
			CPP: { input: "nums = [1,2]", output: "[[],[1],[2],[1,2]]", explanation: "Four subsets." },
		},
		codeSnippets: {
			JAVASCRIPT: `function subsets(nums) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def subsets(self, nums):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function subsets(nums) {\n    const result = [];\n    function backtrack(start, path) {\n        result.push([...path]);\n        for (let i = start; i < nums.length; i++) {\n            path.push(nums[i]);\n            backtrack(i + 1, path);\n            path.pop();\n        }\n    }\n    backtrack(0, []);\n    return result;\n}`,
			PYTHON: `class Solution:\n    def subsets(self, nums):\n        result = []\n        def backtrack(start, path):\n            result.append(path[:])\n            for i in range(start, len(nums)):\n                path.append(nums[i])\n                backtrack(i + 1, path)\n                path.pop()\n        backtrack(0, [])\n        return result`,
			JAVA: `class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        backtrack(0, nums, new ArrayList<>(), result);\n        return result;\n    }\n    private void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> result) {\n        result.add(new ArrayList<>(path));\n        for (int i = start; i < nums.length; i++) {\n            path.add(nums[i]);\n            backtrack(i + 1, nums, path, result);\n            path.remove(path.size() - 1);\n        }\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        vector<vector<int>> result;\n        vector<int> path;\n        backtrack(0, nums, path, result);\n        return result;\n    }\nprivate:\n    void backtrack(int start, vector<int>& nums, vector<int>& path, vector<vector<int>>& result) {\n        result.push_back(path);\n        for (int i = start; i < nums.size(); i++) {\n            path.push_back(nums[i]);\n            backtrack(i + 1, nums, path, result);\n            path.pop_back();\n        }\n    }\n};`,
		},
	},
];

// ============================================
// GREEDY
// ============================================

export const greedyProblems = [
	{
		id: "greedy-1",
		title: "Jump Game",
		description:
			"You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
		difficulty: "MEDIUM" as const,
		tags: ["Greedy", "Array"],
		constraints: "1 <= nums.length <= 10^4. 0 <= nums[i] <= 10^5",
		hints: "Work backwards from the end. Keep track of the furthest position you can reach.",
		editorial: "Track the furthest reachable position as you iterate. If you can't reach even the current index, return false.",
		testCases: [
			{ input: "[2,3,1,1,4]", output: "true" },
			{ input: "[3,2,1,0,4]", output: "false" },
		],
		examples: {
			JAVASCRIPT: {
				input: "nums = [2,3,1,1,4]",
				output: "true",
				explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index.",
			},
			PYTHON: { input: "nums = [3,2,1,0,4]", output: "false", explanation: "You will always arrive at index 3 and can't proceed." },
			JAVA: { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Can reach last index." },
			CPP: { input: "nums = [3,2,1,0,4]", output: "false", explanation: "Stuck at index 3." },
		},
		codeSnippets: {
			JAVASCRIPT: `function canJump(nums) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def canJump(self, nums):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public boolean canJump(int[] nums) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function canJump(nums) {\n    let maxReach = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (i > maxReach) return false;\n        maxReach = Math.max(maxReach, i + nums[i]);\n    }\n    return true;\n}`,
			PYTHON: `class Solution:\n    def canJump(self, nums):\n        max_reach = 0\n        for i in range(len(nums)):\n            if i > max_reach:\n                return False\n            max_reach = max(max_reach, i + nums[i])\n        return True`,
			JAVA: `class Solution {\n    public boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n        }\n        return true;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            if (i > maxReach) return false;\n            maxReach = max(maxReach, i + nums[i]);\n        }\n        return true;\n    }\n};`,
		},
	},
	{
		id: "greedy-2",
		title: "Best Time to Buy and Sell Stock II",
		description:
			"You are given an integer array prices where prices[i] is the price of a given stock on the ith day. On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day. Find and return the maximum profit you can achieve.",
		difficulty: "MEDIUM" as const,
		tags: ["Greedy", "Array"],
		constraints: "1 <= prices.length <= 3 * 10^4. 0 <= prices[i] <= 10^4",
		hints: "Add all positive differences between consecutive days.",
		editorial: "We capture all upward movements. Buy before price goes up, sell before it goes down.",
		testCases: [
			{ input: "[7,1,5,3,6,4]", output: "7" },
			{ input: "[1,2,3,4,5]", output: "4" },
		],
		examples: {
			JAVASCRIPT: { input: "prices = [7,1,5,3,6,4]", output: "7", explanation: "Buy on day 2, sell on day 3, buy on day 4, sell on day 5." },
			PYTHON: { input: "prices = [1,2,3,4,5]", output: "4", explanation: "Buy on day 1, sell on day 5." },
			JAVA: { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profit possible." },
			CPP: { input: "prices = [7,1,5,3,6,4]", output: "7", explanation: "Multiple transactions." },
		},
		codeSnippets: {
			JAVASCRIPT: `function maxProfit(prices) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def maxProfit(self, prices):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int maxProfit(int[] prices) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function maxProfit(prices) {\n    let profit = 0;\n    for (let i = 1; i < prices.length; i++) {\n        if (prices[i] > prices[i-1]) {\n            profit += prices[i] - prices[i-1];\n        }\n    }\n    return profit;\n}`,
			PYTHON: `class Solution:\n    def maxProfit(self, prices):\n        profit = 0\n        for i in range(1, len(prices)):\n            if prices[i] > prices[i-1]:\n                profit += prices[i] - prices[i-1]\n        return profit`,
			JAVA: `class Solution {\n    public int maxProfit(int[] prices) {\n        int profit = 0;\n        for (int i = 1; i < prices.length; i++) {\n            if (prices[i] > prices[i-1]) {\n                profit += prices[i] - prices[i-1];\n            }\n        }\n        return profit;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int profit = 0;\n        for (int i = 1; i < prices.size(); i++) {\n            if (prices[i] > prices[i-1]) {\n                profit += prices[i] - prices[i-1];\n            }\n        }\n        return profit;\n    }\n};`,
		},
	},
];

// ============================================
// SLIDING WINDOW
// ============================================

export const slidingWindowProblems = [
	{
		id: "sw-1",
		title: "Longest Substring Without Repeating Characters",
		description: "Given a string s, find the length of the longest substring without repeating characters.",
		difficulty: "MEDIUM" as const,
		tags: ["Sliding Window", "String", "Hash Table"],
		constraints: "0 <= s.length <= 5 * 10^4. s consists of English letters, digits, symbols and spaces.",
		hints: "Use a sliding window with a hash set to track characters in current window.",
		editorial: "Expand window until duplicate found, then shrink from left. Track maximum length.",
		testCases: [
			{ input: "abcabcbb", output: "3" },
			{ input: "bbbbb", output: "1" },
		],
		examples: {
			JAVASCRIPT: { input: "s = 'abcabcbb'", output: "3", explanation: "The answer is 'abc', with length 3." },
			PYTHON: { input: "s = 'bbbbb'", output: "1", explanation: "The answer is 'b', with length 1." },
			JAVA: { input: "s = 'pwwkew'", output: "3", explanation: "The answer is 'wke', with length 3." },
			CPP: { input: "s = 'abcabcbb'", output: "3", explanation: "Longest is 'abc'." },
		},
		codeSnippets: {
			JAVASCRIPT: `function lengthOfLongestSubstring(s) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def lengthOfLongestSubstring(self, s):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function lengthOfLongestSubstring(s) {\n    let left = 0, maxLen = 0;\n    const set = new Set();\n    for (let right = 0; right < s.length; right++) {\n        while (set.has(s[right])) {\n            set.delete(s[left++]);\n        }\n        set.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}`,
			PYTHON: `class Solution:\n    def lengthOfLongestSubstring(self, s):\n        left, max_len = 0, 0\n        char_set = set()\n        for right in range(len(s)):\n            while s[right] in char_set:\n                char_set.remove(s[left])\n                left += 1\n            char_set.add(s[right])\n            max_len = max(max_len, right - left + 1)\n        return max_len`,
			JAVA: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int left = 0, maxLen = 0;\n        Set<Character> set = new HashSet<>();\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        int left = 0, maxLen = 0;\n        unordered_set<char> charSet;\n        for (int right = 0; right < s.length(); right++) {\n            while (charSet.count(s[right])) {\n                charSet.erase(s[left++]);\n            }\n            charSet.insert(s[right]);\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};`,
		},
	},
	{
		id: "sw-2",
		title: "Maximum Average Subarray I",
		description:
			"You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value.",
		difficulty: "EASY" as const,
		tags: ["Sliding Window", "Array"],
		constraints: "n == nums.length. 1 <= k <= n <= 10^5. -10^4 <= nums[i] <= 10^4",
		hints: "Calculate sum of first k elements, then slide the window by subtracting left element and adding new right element.",
		editorial: "Use sliding window to maintain sum of k elements. Update maximum sum as window moves.",
		testCases: [
			{ input: "[1,12,-5,-6,50,3], 4", output: "12.75" },
			{ input: "[5], 1", output: "5.0" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75", explanation: "Maximum average is (12-5-6+50)/4 = 51/4 = 12.75" },
			PYTHON: { input: "nums = [5], k = 1", output: "5.0", explanation: "Only one element." },
			JAVA: { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75", explanation: "Subarray [12,-5,-6,50]." },
			CPP: { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75", explanation: "Maximum average." },
		},
		codeSnippets: {
			JAVASCRIPT: `function findMaxAverage(nums, k) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def findMaxAverage(self, nums, k):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    double findMaxAverage(vector<int>& nums, int k) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function findMaxAverage(nums, k) {\n    let sum = 0;\n    for (let i = 0; i < k; i++) sum += nums[i];\n    let maxSum = sum;\n    for (let i = k; i < nums.length; i++) {\n        sum += nums[i] - nums[i - k];\n        maxSum = Math.max(maxSum, sum);\n    }\n    return maxSum / k;\n}`,
			PYTHON: `class Solution:\n    def findMaxAverage(self, nums, k):\n        current_sum = sum(nums[:k])\n        max_sum = current_sum\n        for i in range(k, len(nums)):\n            current_sum += nums[i] - nums[i - k]\n            max_sum = max(max_sum, current_sum)\n        return max_sum / k`,
			JAVA: `class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        int sum = 0;\n        for (int i = 0; i < k; i++) sum += nums[i];\n        int maxSum = sum;\n        for (int i = k; i < nums.length; i++) {\n            sum += nums[i] - nums[i - k];\n            maxSum = Math.max(maxSum, sum);\n        }\n        return (double) maxSum / k;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    double findMaxAverage(vector<int>& nums, int k) {\n        int sum = 0;\n        for (int i = 0; i < k; i++) sum += nums[i];\n        int maxSum = sum;\n        for (int i = k; i < nums.size(); i++) {\n            sum += nums[i] - nums[i - k];\n            maxSum = max(maxSum, sum);\n        }\n        return (double) maxSum / k;\n    }\n};`,
		},
	},
];

// ============================================
// TWO POINTERS
// ============================================

export const twoPointersProblems = [
	{
		id: "tp-1",
		title: "Container With Most Water",
		description:
			"You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
		difficulty: "MEDIUM" as const,
		tags: ["Two Pointers", "Array", "Greedy"],
		constraints: "n == height.length. 2 <= n <= 10^5. 0 <= height[i] <= 10^4",
		hints: "Start with widest container. Move pointer of shorter line inward.",
		editorial: "Use two pointers at both ends. Calculate area, then move the pointer at shorter height.",
		testCases: [
			{ input: "[1,8,6,2,5,4,8,3,7]", output: "49" },
			{ input: "[1,1]", output: "1" },
		],
		examples: {
			JAVASCRIPT: {
				input: "height = [1,8,6,2,5,4,8,3,7]",
				output: "49",
				explanation: "Max area is between height[1]=8 and height[8]=7 with width 7.",
			},
			PYTHON: { input: "height = [1,1]", output: "1", explanation: "Area is 1*1 = 1." },
			JAVA: { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 and 8." },
			CPP: { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Maximum area." },
		},
		codeSnippets: {
			JAVASCRIPT: `function maxArea(height) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def maxArea(self, height):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function maxArea(height) {\n    let left = 0, right = height.length - 1, maxArea = 0;\n    while (left < right) {\n        const area = Math.min(height[left], height[right]) * (right - left);\n        maxArea = Math.max(maxArea, area);\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    return maxArea;\n}`,
			PYTHON: `class Solution:\n    def maxArea(self, height):\n        left, right, max_area = 0, len(height) - 1, 0\n        while left < right:\n            area = min(height[left], height[right]) * (right - left)\n            max_area = max(max_area, area)\n            if height[left] < height[right]:\n                left += 1\n            else:\n                right -= 1\n        return max_area`,
			JAVA: `class Solution {\n    public int maxArea(int[] height) {\n        int left = 0, right = height.length - 1, maxArea = 0;\n        while (left < right) {\n            int area = Math.min(height[left], height[right]) * (right - left);\n            maxArea = Math.max(maxArea, area);\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxArea;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int left = 0, right = height.size() - 1, maxArea = 0;\n        while (left < right) {\n            int area = min(height[left], height[right]) * (right - left);\n            maxArea = max(maxArea, area);\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxArea;\n    }\n};`,
		},
	},
	{
		id: "tp-2",
		title: "Valid Palindrome",
		description:
			"A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
		difficulty: "EASY" as const,
		tags: ["Two Pointers", "String"],
		constraints: "1 <= s.length <= 2 * 10^5. s consists only of printable ASCII characters.",
		hints: "Use two pointers from both ends. Skip non-alphanumeric characters.",
		editorial: "Compare characters from both ends while skipping invalid characters.",
		testCases: [
			{ input: "A man, a plan, a canal: Panama", output: "true" },
			{ input: "race a car", output: "false" },
		],
		examples: {
			JAVASCRIPT: { input: "s = 'A man, a plan, a canal: Panama'", output: "true", explanation: "amanaplanacanalpanama is a palindrome." },
			PYTHON: { input: "s = 'race a car'", output: "false", explanation: "raceacar is not a palindrome." },
			JAVA: { input: "s = ' '", output: "true", explanation: "Empty string is palindrome." },
			CPP: { input: "s = 'A man, a plan, a canal: Panama'", output: "true", explanation: "Valid palindrome." },
		},
		codeSnippets: {
			JAVASCRIPT: `function isPalindrome(s) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def isPalindrome(self, s):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function isPalindrome(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;\n        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;\n        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n        left++;\n        right--;\n    }\n    return true;\n}`,
			PYTHON: `class Solution:\n    def isPalindrome(self, s):\n        left, right = 0, len(s) - 1\n        while left < right:\n            while left < right and not s[left].isalnum():\n                left += 1\n            while left < right and not s[right].isalnum():\n                right -= 1\n            if s[left].lower() != s[right].lower():\n                return False\n            left += 1\n            right -= 1\n        return True`,
			JAVA: `class Solution {\n    public boolean isPalindrome(String s) {\n        int left = 0, right = s.length() - 1;\n        while (left < right) {\n            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;\n            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;\n            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;\n            left++;\n            right--;\n        }\n        return true;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int left = 0, right = s.length() - 1;\n        while (left < right) {\n            while (left < right && !isalnum(s[left])) left++;\n            while (left < right && !isalnum(s[right])) right--;\n            if (tolower(s[left]) != tolower(s[right])) return false;\n            left++;\n            right--;\n        }\n        return true;\n    }\n};`,
		},
	},
];

// ============================================
// BIT MANIPULATION
// ============================================

export const bitManipulationProblems = [
	{
		id: "bit-1",
		title: "Single Number",
		description:
			"Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
		difficulty: "EASY" as const,
		tags: ["Bit Manipulation", "Array"],
		constraints:
			"1 <= nums.length <= 3 * 10^4. -3 * 10^4 <= nums[i] <= 3 * 10^4. Each element in the array appears twice except for one element which appears only once.",
		hints: "Use XOR operation. a XOR a = 0, a XOR 0 = a.",
		editorial: "XOR all numbers together. Duplicate pairs cancel out, leaving the single number.",
		testCases: [
			{ input: "[2,2,1]", output: "1" },
			{ input: "[4,1,2,1,2]", output: "4" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [2,2,1]", output: "1", explanation: "1 appears once." },
			PYTHON: { input: "nums = [4,1,2,1,2]", output: "4", explanation: "4 is the single number." },
			JAVA: { input: "nums = [1]", output: "1", explanation: "Only one element." },
			CPP: { input: "nums = [2,2,1]", output: "1", explanation: "Single number is 1." },
		},
		codeSnippets: {
			JAVASCRIPT: `function singleNumber(nums) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def singleNumber(self, nums):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int singleNumber(int[] nums) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function singleNumber(nums) {\n    let result = 0;\n    for (let num of nums) result ^= num;\n    return result;\n}`,
			PYTHON: `class Solution:\n    def singleNumber(self, nums):\n        result = 0\n        for num in nums:\n            result ^= num\n        return result`,
			JAVA: `class Solution {\n    public int singleNumber(int[] nums) {\n        int result = 0;\n        for (int num : nums) result ^= num;\n        return result;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int result = 0;\n        for (int num : nums) result ^= num;\n        return result;\n    }\n};`,
		},
	},
	{
		id: "bit-2",
		title: "Number of 1 Bits",
		description: "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
		difficulty: "EASY" as const,
		tags: ["Bit Manipulation"],
		constraints: "The input must be a binary string of length 32.",
		hints: "Use n & (n-1) to remove the rightmost 1 bit. Or check each bit with n & 1.",
		editorial: "Count 1 bits by repeatedly removing the rightmost 1 using n & (n-1) trick.",
		testCases: [
			{ input: "00000000000000000000000000001011", output: "3" },
			{ input: "00000000000000000000000010000000", output: "1" },
		],
		examples: {
			JAVASCRIPT: { input: "n = 00000000000000000000000000001011", output: "3", explanation: "Input has three '1' bits." },
			PYTHON: { input: "n = 00000000000000000000000010000000", output: "1", explanation: "One '1' bit." },
			JAVA: { input: "n = 11111111111111111111111111111101", output: "31", explanation: "31 one bits." },
			CPP: { input: "n = 00000000000000000000000000001011", output: "3", explanation: "Three 1 bits." },
		},
		codeSnippets: {
			JAVASCRIPT: `function hammingWeight(n) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def hammingWeight(self, n):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int hammingWeight(int n) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function hammingWeight(n) {\n    let count = 0;\n    while (n) {\n        count++;\n        n &= n - 1;\n    }\n    return count;\n}`,
			PYTHON: `class Solution:\n    def hammingWeight(self, n):\n        count = 0\n        while n:\n            count += 1\n            n &= n - 1\n        return count`,
			JAVA: `class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            count++;\n            n &= n - 1;\n        }\n        return count;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        int count = 0;\n        while (n) {\n            count++;\n            n &= n - 1;\n        }\n        return count;\n    }\n};`,
		},
	},
];

// ============================================
// HEAP
// ============================================

export const heapProblems = [
	{
		id: "heap-1",
		title: "Kth Largest Element in an Array",
		description:
			"Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
		difficulty: "MEDIUM" as const,
		tags: ["Heap", "Divide and Conquer", "Sorting", "Quick Select"],
		constraints: "1 <= k <= nums.length <= 10^5. -10^4 <= nums[i] <= 10^4",
		hints: "Use a min heap of size k. Or use quickselect algorithm.",
		editorial: "Maintain a min heap of k elements. The root is the kth largest.",
		testCases: [
			{ input: "[3,2,1,5,6,4], 2", output: "5" },
			{ input: "[3,2,3,1,2,4,5,5,6], 4", output: "4" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "2nd largest is 5." },
			PYTHON: { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4", explanation: "4th largest is 4." },
			JAVA: { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "Kth largest." },
			CPP: { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "2nd largest element." },
		},
		codeSnippets: {
			JAVASCRIPT: `function findKthLargest(nums, k) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def findKthLargest(self, nums, k):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function findKthLargest(nums, k) {\n    const minHeap = [];\n    for (let num of nums) {\n        minHeap.push(num);\n        minHeap.sort((a, b) => a - b);\n        if (minHeap.length > k) minHeap.shift();\n    }\n    return minHeap[0];\n}`,
			PYTHON: `import heapq\nclass Solution:\n    def findKthLargest(self, nums, k):\n        min_heap = []\n        for num in nums:\n            heapq.heappush(min_heap, num)\n            if len(min_heap) > k:\n                heapq.heappop(min_heap)\n        return min_heap[0]`,
			JAVA: `class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n        for (int num : nums) {\n            minHeap.offer(num);\n            if (minHeap.size() > k) minHeap.poll();\n        }\n        return minHeap.peek();\n    }\n}`,
			CPP: `class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        priority_queue<int, vector<int>, greater<int>> minHeap;\n        for (int num : nums) {\n            minHeap.push(num);\n            if (minHeap.size() > k) minHeap.pop();\n        }\n        return minHeap.top();\n    }\n};`,
		},
	},
	{
		id: "heap-2",
		title: "Top K Frequent Elements",
		description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
		difficulty: "MEDIUM" as const,
		tags: ["Heap", "Hash Table", "Sorting", "Bucket Sort"],
		constraints: "1 <= nums.length <= 10^5. -10^4 <= nums[i] <= 10^4. k is in the range [1, the number of unique elements in the array].",
		hints: "Count frequencies with hash map. Use heap to get top k frequent.",
		editorial: "Create frequency map, then use max heap or bucket sort to get k most frequent.",
		testCases: [
			{ input: "[1,1,1,2,2,3], 2", output: "[1,2]" },
			{ input: "[1], 1", output: "[1]" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "1 and 2 are most frequent." },
			PYTHON: { input: "nums = [1], k = 1", output: "[1]", explanation: "Only one element." },
			JAVA: { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "Top 2 frequent." },
			CPP: { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "Most frequent elements." },
		},
		codeSnippets: {
			JAVASCRIPT: `function topKFrequent(nums, k) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def topKFrequent(self, nums, k):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function topKFrequent(nums, k) {\n    const freq = new Map();\n    for (let num of nums) freq.set(num, (freq.get(num) || 0) + 1);\n    return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(x => x[0]);\n}`,
			PYTHON: `from collections import Counter\nimport heapq\nclass Solution:\n    def topKFrequent(self, nums, k):\n        count = Counter(nums)\n        return heapq.nlargest(k, count.keys(), key=count.get)`,
			JAVA: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int num : nums) freq.put(num, freq.getOrDefault(num, 0) + 1);\n        PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b));\n        for (int num : freq.keySet()) {\n            heap.offer(num);\n            if (heap.size() > k) heap.poll();\n        }\n        int[] result = new int[k];\n        for (int i = 0; i < k; i++) result[i] = heap.poll();\n        return result;\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        unordered_map<int, int> freq;\n        for (int num : nums) freq[num]++;\n        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;\n        for (auto& [num, count] : freq) {\n            minHeap.push({count, num});\n            if (minHeap.size() > k) minHeap.pop();\n        }\n        vector<int> result;\n        while (!minHeap.empty()) {\n            result.push_back(minHeap.top().second);\n            minHeap.pop();\n        }\n        return result;\n    }\n};`,
		},
	},
];

// ============================================
// SORTING
// ============================================

export const sortingProblems = [
	{
		id: "sort-1",
		title: "Sort Colors",
		description:
			"Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.",
		difficulty: "MEDIUM" as const,
		tags: ["Sorting", "Array", "Two Pointers"],
		constraints: "n == nums.length. 1 <= n <= 300. nums[i] is either 0, 1, or 2.",
		hints: "Use Dutch National Flag algorithm with three pointers.",
		editorial: "Maintain three pointers: low for 0s, mid for traversal, high for 2s.",
		testCases: [
			{ input: "[2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
			{ input: "[2,0,1]", output: "[0,1,2]" },
		],
		examples: {
			JAVASCRIPT: { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]", explanation: "Sorted by color." },
			PYTHON: { input: "nums = [2,0,1]", output: "[0,1,2]", explanation: "Three elements sorted." },
			JAVA: { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]", explanation: "In-place sort." },
			CPP: { input: "nums = [2,0,1]", output: "[0,1,2]", explanation: "Sorted array." },
		},
		codeSnippets: {
			JAVASCRIPT: `function sortColors(nums) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def sortColors(self, nums):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public void sortColors(int[] nums) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function sortColors(nums) {\n    let low = 0, mid = 0, high = nums.length - 1;\n    while (mid <= high) {\n        if (nums[mid] === 0) {\n            [nums[low], nums[mid]] = [nums[mid], nums[low]];\n            low++;\n            mid++;\n        } else if (nums[mid] === 1) {\n            mid++;\n        } else {\n            [nums[mid], nums[high]] = [nums[high], nums[mid]];\n            high--;\n        }\n    }\n}`,
			PYTHON: `class Solution:\n    def sortColors(self, nums):\n        low, mid, high = 0, 0, len(nums) - 1\n        while mid <= high:\n            if nums[mid] == 0:\n                nums[low], nums[mid] = nums[mid], nums[low]\n                low += 1\n                mid += 1\n            elif nums[mid] == 1:\n                mid += 1\n            else:\n                nums[mid], nums[high] = nums[high], nums[mid]\n                high -= 1`,
			JAVA: `class Solution {\n    public void sortColors(int[] nums) {\n        int low = 0, mid = 0, high = nums.length - 1;\n        while (mid <= high) {\n            if (nums[mid] == 0) {\n                int temp = nums[low];\n                nums[low] = nums[mid];\n                nums[mid] = temp;\n                low++;\n                mid++;\n            } else if (nums[mid] == 1) {\n                mid++;\n            } else {\n                int temp = nums[mid];\n                nums[mid] = nums[high];\n                nums[high] = temp;\n                high--;\n            }\n        }\n    }\n}`,
			CPP: `class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        int low = 0, mid = 0, high = nums.size() - 1;\n        while (mid <= high) {\n            if (nums[mid] == 0) {\n                swap(nums[low], nums[mid]);\n                low++;\n                mid++;\n            } else if (nums[mid] == 1) {\n                mid++;\n            } else {\n                swap(nums[mid], nums[high]);\n                high--;\n            }\n        }\n    }\n};`,
		},
	},
	{
		id: "sort-2",
		title: "Merge Intervals",
		description:
			"Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
		difficulty: "MEDIUM" as const,
		tags: ["Sorting", "Array"],
		constraints: "1 <= intervals.length <= 10^4. intervals[i].length == 2. 0 <= starti <= endi <= 10^4",
		hints: "Sort intervals by start time. Merge overlapping intervals as you iterate.",
		editorial: "Sort by start time, then iterate and merge when current interval overlaps with previous.",
		testCases: [
			{ input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
			{ input: "[[1,4],[4,5]]", output: "[[1,5]]" },
		],
		examples: {
			JAVASCRIPT: {
				input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
				output: "[[1,6],[8,10],[15,18]]",
				explanation: "[1,3] and [2,6] overlap.",
			},
			PYTHON: { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals overlap at 4." },
			JAVA: { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Merged overlapping." },
			CPP: { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Merged intervals." },
		},
		codeSnippets: {
			JAVASCRIPT: `function merge(intervals) {\n    // Your code here\n}`,
			PYTHON: `class Solution:\n    def merge(self, intervals):\n        # Your code here\n        pass`,
			JAVA: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Your code here\n    }\n};`,
		},
		referenceSolutions: {
			JAVASCRIPT: `function merge(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const result = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const last = result[result.length - 1];\n        if (intervals[i][0] <= last[1]) {\n            last[1] = Math.max(last[1], intervals[i][1]);\n        } else {\n            result.push(intervals[i]);\n        }\n    }\n    return result;\n}`,
			PYTHON: `class Solution:\n    def merge(self, intervals):\n        intervals.sort(key=lambda x: x[0])\n        result = [intervals[0]]\n        for interval in intervals[1:]:\n            if interval[0] <= result[-1][1]:\n                result[-1][1] = max(result[-1][1], interval[1])\n            else:\n                result.append(interval)\n        return result`,
			JAVA: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> result = new ArrayList<>();\n        result.add(intervals[0]);\n        for (int i = 1; i < intervals.length; i++) {\n            int[] last = result.get(result.size() - 1);\n            if (intervals[i][0] <= last[1]) {\n                last[1] = Math.max(last[1], intervals[i][1]);\n            } else {\n                result.add(intervals[i]);\n            }\n        }\n        return result.toArray(new int[result.size()][]);\n    }\n}`,
			CPP: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> result = {intervals[0]};\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= result.back()[1]) {\n                result.back()[1] = max(result.back()[1], intervals[i][1]);\n            } else {\n                result.push_back(intervals[i]);\n            }\n        }\n        return result;\n    }\n};`,
		},
	},
];

// Export all problem types grouped
export const problemsByType = {
	DP: dpProblems,
	String: stringProblems,
	Array: arrayProblems,
	Graph: graphProblems,
	Tree: treeProblems,
	LinkedList: linkedListProblems,
	BinarySearch: binarySearchProblems,
	Stack: stackProblems,
	Backtracking: backtrackingProblems,
	Greedy: greedyProblems,
	SlidingWindow: slidingWindowProblems,
	TwoPointers: twoPointersProblems,
	BitManipulation: bitManipulationProblems,
	Heap: heapProblems,
	Sorting: sortingProblems,
};

// Export default sample (first problem of each type)
export const defaultSamples = {
	DP: dpProblems[0],
	String: stringProblems[0],
	Array: arrayProblems[0],
	Graph: graphProblems[0],
	Tree: treeProblems[0],
};
