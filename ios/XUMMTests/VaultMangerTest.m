//
//  VaultManagerTest.m
//  XUMMTests
//

#import <XCTest/XCTest.h>

#import "../XUMM/Libs/Security/Vault/VaultManager.h"
#import "../XUMM/Libs/Security/Vault/Cipher/Cipher.h"
#import "../XUMM/Libs/Security/Vault/Storage/Keychain.h"

#import "PerformanceLogger.h"

@interface VaultManagerTest : XCTestCase
@end

@implementation VaultManagerTest

static NSString* VAULT_NAME = @"VAULT_TEST";
static NSString* VAULT_DATA = @"VAULT_TEST_DATA";
static NSString* VAULT_KEY = @"VAULT_TEST_KEY";
static NSString* STORAGE_ENCRYPTION_KEY = @"STORAGE_ENCRYPTION_KEY";
static PerformanceLogger *performanceLogger;


+ (void)setUp {
  // setup performance logger
  performanceLogger = [[PerformanceLogger alloc] initWithTag:@"VaultMangerTestReport"];

  // clear vault before starting the tests
  [VaultManagerModule purgeAll];
}

+ (void)tearDown {
  [performanceLogger log];
}

- (void)testVault {
  // should return false as vault is not exist
  [performanceLogger start:@"VAULT_EXIST_FALSE"];
  XCTAssertFalse([VaultManagerModule vaultExist:VAULT_NAME]);
  [performanceLogger end:@"VAULT_EXIST_FALSE"];
  // should create the vault with the latest cipher and store in the keychain
  [performanceLogger start:@"CREATE_VAULT_NEW"];
  XCTAssertTrue([VaultManagerModule createVault:VAULT_NAME data:VAULT_DATA key:VAULT_KEY]);
  [performanceLogger end:@"CREATE_VAULT_NEW"];
  // should return true as vault is exist
  [performanceLogger start:@"VAULT_EXIST_TRUE"];
  XCTAssertTrue([VaultManagerModule vaultExist:VAULT_NAME]);
  [performanceLogger end:@"VAULT_EXIST_TRUE"];
  // try to create the same vault again, which should raise an error
  [performanceLogger start:@"CREATE_VAULT_EXIST"];
  XCTAssertThrows([VaultManagerModule createVault:VAULT_NAME data:VAULT_DATA key:VAULT_KEY]);
  [performanceLogger end:@"CREATE_VAULT_EXIST"];
  // verify we can fetch the vault and open with the provided key
  [performanceLogger start:@"OPEN_VAULT"];
  XCTAssertTrue([VAULT_DATA isEqualToString:[VaultManagerModule openVault:VAULT_NAME key:VAULT_KEY]]);
  [performanceLogger end:@"OPEN_VAULT"];
  // should return false for migration required as vault has been created with latest cipher
  [performanceLogger start:@"IS_MIGRATION_REQUIRED"];
  NSDictionary *migrationRequiredResult = [VaultManagerModule isMigrationRequired:VAULT_NAME];
  [performanceLogger end:@"IS_MIGRATION_REQUIRED"];
  XCTAssertEqual(NO, [[migrationRequiredResult valueForKey:@"migration_required"] boolValue]);
  XCTAssertEqual([[Cipher getLatestCipherVersion] intValue], [[migrationRequiredResult valueForKey:@"latest_cipher_version"] intValue]);
  XCTAssertEqual([[Cipher getLatestCipherVersion] intValue], [[migrationRequiredResult valueForKey:@"current_cipher_version"] intValue]);
  // purge vault
  [performanceLogger start:@"PURGE_VAULT"];
  XCTAssertTrue([VaultManagerModule purgeVault:VAULT_NAME]);
  [performanceLogger end:@"PURGE_VAULT"];
  // should return false as vault purged
  XCTAssertFalse([VaultManagerModule vaultExist:VAULT_NAME]);
}


- (void)testStorageEncryptionKey {
  NSError *error;
  // check if the key is not exist
  XCTAssertNil([Keychain getItem:STORAGE_ENCRYPTION_KEY error:&error]);
  XCTAssertNil(error);
  // should generate new encryption key and store in the keychain
  [performanceLogger start:@"GET_STORAGE_ENCRYPTION_KEY_GENERATE"];
  XCTAssertNotNil([VaultManagerModule getStorageEncryptionKey:STORAGE_ENCRYPTION_KEY]);
  [performanceLogger end:@"GET_STORAGE_ENCRYPTION_KEY_GENERATE"];
  // get newly generated encryption from keychain
  NSDictionary *item = [Keychain getItem:STORAGE_ENCRYPTION_KEY error:&error];
  XCTAssertNil(error);
  NSString *storageEncryptionKey = item[@"data"];
  // should not be null
  XCTAssertNotNil(storageEncryptionKey);
  // check newly generated key length be 64 bytes
  XCTAssertEqual(128, [storageEncryptionKey length]);
  // running the same method again should resolve to same encryption key
  [performanceLogger start:@"GET_STORAGE_ENCRYPTION_KEY_FETCH"];
  XCTAssertTrue([storageEncryptionKey isEqualToString:[VaultManagerModule getStorageEncryptionKey:STORAGE_ENCRYPTION_KEY]]);
  [performanceLogger end:@"GET_STORAGE_ENCRYPTION_KEY_FETCH"];
}

@end
