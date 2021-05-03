#Write your code here
def isprime(n):
	for i in range(2,n):
		if (n%i == 0):
			return False
			break
	return True


print(isprime(7))
print(isprime(8))

	